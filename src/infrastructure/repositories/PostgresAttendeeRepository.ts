import { sql } from '@vercel/postgres';
import { IAttendeeRepository } from '../../domain/repositories/IAttendeeRepository';
import { Attendee } from '../../domain/entities/Attendee';

export class PostgresAttendeeRepository implements IAttendeeRepository {
  
  async fetchFiltered(query: string, page: number): Promise<Attendee[]> {
    try {
      const offset = (page - 1) * 10;

      // First, verify the connection and table existence
      await sql`SELECT 1 FROM attendees LIMIT 1`;

      const result = await sql`
        SELECT 
          a.id,
          a.classe_id,
          a.user_id,
          a.product,
          COALESCE(c.nom_de_la_classe, '') as nom_de_la_classe,
          COALESCE(c.date_et_heure, CURRENT_TIMESTAMP) as date_et_heure,
          COALESCE(c.type_id, 0) as classe_type
        FROM attendees a
        LEFT JOIN classe c ON a.classe_id = c.id
        WHERE 
          COALESCE(c.nom_de_la_classe, '') ILIKE ${`%${query}%`} OR
          COALESCE(c.date_et_heure::text, '') ILIKE ${`%${query}%`}
        ORDER BY COALESCE(c.date_et_heure, CURRENT_TIMESTAMP) ASC
        LIMIT 10 OFFSET ${offset}
      `;
      
      if (!result.rows) {
        console.error('No rows returned from database');
        return []; // Return empty array instead of throwing
      }

      return result.rows.map(row => ({
        id: row.id,
        classe_id: row.classe_id,
        user_id: row.user_id,
        product: row.product,
        nom_de_la_classe: row.nom_de_la_classe,
        date_et_heure: row.date_et_heure,
        classe_type: row.classe_type
      }));
    } catch (error) {
      console.error('Error in fetchFiltered:', error);
      throw new Error(`Failed to fetch filtered attendees: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  async findByClassAndUser(classe_id: number, user_id: string): Promise<Attendee | null> {
    const result = await sql`
      SELECT 
        a.id, 
        a.classe_id, 
        a.user_id, 
        a.product,
        c.nom_de_la_classe as classe_name,
        c.date_et_heure as classe_date,
        a.created_at as booking_date,
        c.type_id as classe_type
      FROM attendees a
      JOIN classe c ON a.classe_id = c.id
      WHERE a.classe_id = ${classe_id} AND a.user_id = ${user_id}
    `;

    if (!result.rows[0]) return null;

    return {
      id: result.rows[0].id,
      classe_id: result.rows[0].classe_id,
      user_id: result.rows[0].user_id,
      product: result.rows[0].product,
    };
  }

  async create(
    classe_id: number,
    user_id: string,
    product: string
  ): Promise<void> {
    const result = await sql`
      INSERT INTO attendees 
      (classe_id, user_id, product)
      VALUES (
        ${classe_id}, 
        ${user_id}, 
        ${product}
      )
    `;
  }

  async getUserProfile(user_id: string | ''): Promise<{ id: number } | null> {
    if (!user_id) return null;
    const result = await sql`
      SELECT id FROM profiles
      WHERE user_id = ${user_id}
    `;
    return {
      id: result.rows[0].id
    }
  }

  async updateUsedCredits(subscription_id: number): Promise<void> {
    await sql`
      UPDATE abonnements
      SET used_credits_this_week = used_credits_this_week + 1
      WHERE id = ${subscription_id}
    `;
  }

  async updateCarteCredits(carte_id: number): Promise<void> {
    await sql`
      UPDATE carte_a_10
      SET nombre_credits = nombre_credits - 1
      WHERE id = ${carte_id}
    `;
  }

  async delete(id: number): Promise<void> {
    try {
      // Start a transaction
      await sql`BEGIN`;

      // First get the attendee details to check the product and classe_id
      const attendeeResult = await sql`
        SELECT a.*, 
        u.id as user_id,
        p.id as profile_id,
        a.classe_id
        FROM attendees a
        JOIN users u ON a.user_id = u.id
        JOIN profiles p ON u.id = p.user_id
        WHERE a.id = ${id}
      `;

      if (attendeeResult.rows[0]?.product === 'carte à 10') {
        // Get the active carte_a_10 for the user
        const carteResult = await sql`
          SELECT id, nombre_credits
          FROM carte_a_10
          WHERE profile_id = ${attendeeResult.rows[0].profile_id}
          AND status = true
          LIMIT 1
        `;

        if (carteResult.rows[0]) {
          // Increment the credits
          await sql`
            UPDATE carte_a_10
            SET nombre_credits = nombre_credits + 1
            WHERE id = ${carteResult.rows[0].id}
            AND status = true
          `;
        }
      }

      // Delete the attendee
      await sql`
        DELETE FROM attendees
        WHERE id = ${id}
      `;

      // Increment the nombre_de_places_disponibles in the classe table
      if (attendeeResult.rows[0]?.classe_id) {
        await sql`
          UPDATE classe
          SET nombre_de_places_disponibles = nombre_de_places_disponibles + 1
          WHERE id = ${attendeeResult.rows[0].classe_id}
        `;
      }

      // Commit the transaction
      await sql`COMMIT`;
    } catch (error) {
      // Rollback in case of error
      await sql`ROLLBACK`;
      console.error('Error in delete attendee:', error);
      throw error;
    }
  }

  async getUserSubscription(profile_id: number): Promise<{
    id: number,
    default_classe_1_nom_de_la_classe: string,
    default_classe_2_nom_de_la_classe: string
  } | null> {
    const result = await sql`
    SELECT 
      a.id,
      c1.nom_de_la_classe AS default_classe_1_nom_de_la_classe,
      c2.nom_de_la_classe AS default_classe_2_nom_de_la_classe
    FROM abonnements a
    LEFT JOIN classe c1 ON a.default_classe_1 = c1.id
    LEFT JOIN classe c2 ON a.default_classe_2 = c2.id
    WHERE a.profile_id = ${profile_id}
    LIMIT 1
  `;

    if (!result.rows[0]) return null;

    return {
      id: result.rows[0].id,
      default_classe_1_nom_de_la_classe: result.rows[0].default_classe_1_nom_de_la_classe,
      default_classe_2_nom_de_la_classe: result.rows[0].default_classe_2_nom_de_la_classe
    };
  }

  async getClassInfo(classe_id: number): Promise<{ id: number, nom_de_la_classe: string } | null> {
    const result = await sql`
      SELECT id, nom_de_la_classe
      FROM classe
      WHERE id = ${classe_id}
    `;

    if (!result.rows[0]) return null;

    return {
      id: result.rows[0].id,
      nom_de_la_classe: result.rows[0].nom_de_la_classe
    };
  }

  async getUserCarte(profile_id: number): Promise<{ id: number } | null> {
    const result = await sql`
      SELECT id FROM carte_a_10 WHERE profile_id = ${profile_id} AND status = true
    `;
    if (!result.rows[0]) return null;
    return {
      id: result.rows[0].id as number
    };
  }

  async getClassDayOfWeek(classe_id: number): Promise<{ nom_de_la_classe: string } | null> {
    const result = await sql`
      SELECT nom_de_la_classe FROM classe WHERE id = ${classe_id}  
    `;
    if (!result.rows[0]) return null;
    return {
      nom_de_la_classe: result.rows[0].nom_de_la_classe as string
    };
  }

  async findById(id: number): Promise<Attendee | null> {
    const result = await sql`
      SELECT a.*
      FROM attendees a
      WHERE a.id = ${id}
    `;

    if (!result.rows[0]) return null;

    return {
      id: result.rows[0].id,
      classe_id: result.rows[0].classe_id,
      user_id: result.rows[0].user_id,
      product: result.rows[0].product,
    };
  }

  async fetchFilteredAttendees(query: string, limit: number, offset: number): Promise<any[]> {
    const { rows } = await sql`
      SELECT *
      FROM attendees
      WHERE 
        nom_de_la_classe ILIKE ${`%${query}%`} OR
        user_name ILIKE ${`%${query}%`}
      ORDER BY classe_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows;
  }

  async getFilteredAttendeesCount(query: string): Promise<number> {
    const { rows } = await sql`
      SELECT COUNT(*) as count
      FROM attendees
      LEFT JOIN classe c ON attendees.classe_id = c.id
      LEFT JOIN users u ON attendees.user_id = u.id
      WHERE 
        c.nom_de_la_classe ILIKE ${`%${query}%`} OR
        u.name ILIKE ${`%${query}%`}
    `;
    return parseInt(rows[0].count);
  }

  async getTotalAttendees(query: string): Promise<number> {
    try {
      const result = await sql`
        SELECT COUNT(*) as count
        FROM attendees a
        LEFT JOIN classe c ON a.classe_id = c.id
        WHERE 
          COALESCE(c.nom_de_la_classe, '') ILIKE ${`%${query}%`} OR
          COALESCE(c.date_et_heure::text, '') ILIKE ${`%${query}%`}
      `;
      
      return Number(result.rows[0].count);
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to get total attendees count');
    }
  }

  async findAndDelete(id: number): Promise<Attendee | null> {
    try {
      // Use a CTE to get all necessary data in a single query
      const result = await sql`
        WITH attendee_data AS (
          SELECT 
            a.*,
            c.nombre_de_places_disponibles,
            p.id as profile_id
          FROM attendees a
          JOIN classe c ON a.classe_id = c.id
          JOIN profiles p ON a.user_id = p.user_id
          WHERE a.id = ${id}
        ),
        deleted_attendee AS (
          DELETE FROM attendees
          WHERE id = ${id}
          RETURNING *
        ),
        update_classe AS (
          UPDATE classe c
          SET nombre_de_places_disponibles = c.nombre_de_places_disponibles + 1
          FROM attendee_data ad
          WHERE c.id = ad.classe_id
        ),
        update_carte AS (
          UPDATE carte_a_10 ca
          SET nombre_credits = ca.nombre_credits + 1
          FROM attendee_data ad
          WHERE ca.profile_id = ad.profile_id
          AND ca.status = true
          AND EXISTS (
            SELECT 1 FROM deleted_attendee 
            WHERE product = 'carte à 10'
          )
        )
        SELECT d.*, ad.profile_id
        FROM deleted_attendee d
        JOIN attendee_data ad ON true
      `;

      if (!result.rows[0]) {
        return null;
      }

      return {
        id: result.rows[0].id,
        classe_id: result.rows[0].classe_id,
        user_id: result.rows[0].user_id,
        product: result.rows[0].product,
      };
    } catch (error) {
      console.error('Error in findAndDelete:', error);
      throw new Error(
        `Failed to delete attendee: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
