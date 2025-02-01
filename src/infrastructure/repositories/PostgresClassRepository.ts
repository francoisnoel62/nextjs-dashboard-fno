import { sql } from '@vercel/postgres';
import { IClassRepository } from '../../domain/repositories/IClassRepository';
import { Class } from '../../domain/entities/Class';

export class PostgresClassRepository implements IClassRepository {
  async findById(id: number): Promise<Class | null> {
    const result = await sql`
      SELECT c.id, 
             c.nom_de_la_classe, 
             c.date_et_heure, 
             c.nombre_de_places_disponibles, 
             t.id as type_id
      FROM classe c
      LEFT JOIN classetype t ON c.type_id = t.id
      WHERE c.id = ${id}
    `;
    
    if (!result.rows[0]) return null;
    
    return {
      id: result.rows[0].id,
      nom_de_la_classe: result.rows[0].nom_de_la_classe,
      date_et_heure: new Date(result.rows[0].date_et_heure),
      nombre_de_places_disponibles: result.rows[0].nombre_de_places_disponibles,
      type_id: result.rows[0].type_id
    };
  }

  async updateAvailableSlots(id: number): Promise<void> {
    await sql`
      UPDATE classe
      SET nombre_de_places_disponibles = nombre_de_places_disponibles - 1
      WHERE id = ${id}
    `;
  }
}
