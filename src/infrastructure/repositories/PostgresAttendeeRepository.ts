import { sql } from '@vercel/postgres';
import { IAttendeeRepository } from '../../domain/repositories/IAttendeeRepository';
import { Attendee } from '../../domain/entities/Attendee';

export class PostgresAttendeeRepository implements IAttendeeRepository {
  async findByClassAndUser(classe_id: number, user_id: string): Promise<Attendee | null> {
    const result = await sql`
      SELECT id, classe_id, user_id, product 
      FROM attendees 
      WHERE classe_id = ${classe_id} AND user_id = ${user_id}
    `;

    if (!result.rows[0]) return null;

    return {
      id: result.rows[0].id,
      classe_id: result.rows[0].classe_id,
      user_id: result.rows[0].user_id,
      product: result.rows[0].product
    };
  }

  async create(attendee: Attendee): Promise<Attendee> {
    const result = await sql`
      INSERT INTO attendees (classe_id, user_id, product)
      VALUES (${attendee.classe_id}, ${attendee.user_id}, ${attendee.product})
      RETURNING *
    `;
    return {
      id: result.rows[0].id,
      classe_id: result.rows[0].classe_id,
      user_id: result.rows[0].user_id,
      product: result.rows[0].product
    };
  }

  async getUserProfile(user_id: string): Promise<{ id: number } | null> {
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

  async delete(id: string): Promise<void> {
    await sql`
      DELETE FROM attendees
      WHERE id = ${id}
    `;
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

  async getClassDayOfWeek(classe_id: number): Promise<{ day_of_week: string } | null> {
    const result = await sql`
      SELECT day_of_week FROM classe WHERE id = ${classe_id}  
    `;
    if (!result.rows[0]) return null;
    return {
      day_of_week: result.rows[0].day_of_week as string
    };
  }
}
