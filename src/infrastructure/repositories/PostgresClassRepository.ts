import { sql } from '@vercel/postgres';
import { IClassRepository } from '../../domain/repositories/IClassRepository';
import { Class } from '../../domain/entities/Class';
import { ClassType } from '../../domain/entities/ClassType';

const ITEMS_PER_PAGE = 6;

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
            type_id: result.rows[0].type_id,
            type_name: result.rows[0].type_name
        };
    }

    async findAll(): Promise<Class[]> {
        const result = await sql`
            SELECT c.*, t.type_name 
            FROM classe c
            LEFT JOIN classetype t ON c.type_id = t.id
            ORDER BY c.date_et_heure DESC
        `;
        
        return result.rows.map(row => ({
            id: row.id,
            nom_de_la_classe: row.nom_de_la_classe,
            date_et_heure: new Date(row.date_et_heure),
            nombre_de_places_disponibles: row.nombre_de_places_disponibles,
            type_id: row.type_id
        }));
    }

    async findFiltered(query: string, currentPage: number): Promise<Class[]> {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        
        const result = await sql`
            SELECT c.*, 
            t.type_name as type_name 
            FROM classe c
            LEFT JOIN classetype t ON c.type_id = t.id
            WHERE 
                c.date_et_heure > CURRENT_DATE AND
                (c.nom_de_la_classe ILIKE ${`%${query}%`} OR
                t.type_name ILIKE ${`%${query}%`} OR
                c.date_et_heure::text ILIKE ${`%${query}%`})
                
            ORDER BY c.date_et_heure ASC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
        
        return result.rows.map(row => ({
            id: row.id,
            nom_de_la_classe: row.nom_de_la_classe,
            date_et_heure: new Date(row.date_et_heure),
            nombre_de_places_disponibles: row.nombre_de_places_disponibles,
            type_id: row.type_id,
            type_name: row.type_name
        }));
    }

    async getPageCount(query: string): Promise<number> {
        const result = await sql`
            SELECT COUNT(*)
            FROM classe c
            LEFT JOIN classetype t ON c.type_id = t.id
            WHERE 
                c.date_et_heure > CURRENT_DATE AND
                (c.nom_de_la_classe ILIKE ${`%${query}%`} OR
                t.type_name ILIKE ${`%${query}%`} OR
                c.date_et_heure::text ILIKE ${`%${query}%`})
        `;
        
        return Math.ceil(Number(result.rows[0].count) / ITEMS_PER_PAGE);
    }

    async updateAvailableSlots(id: number): Promise<void> {
        await sql`
            UPDATE classe
            SET nombre_de_places_disponibles = nombre_de_places_disponibles - 1
            WHERE id = ${id}
        `;
    }

    async getTypes(): Promise<ClassType[]> {
        const result = await sql`
            SELECT id, type_name 
            FROM classetype
            ORDER BY type_name ASC
        `;
        
        return result.rows.map((row) => ({
            id: row.id,
            type_name: row.type_name,
        }));
    }
}