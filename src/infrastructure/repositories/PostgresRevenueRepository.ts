import { sql } from '@vercel/postgres';
import { IRevenueRepository } from '../../domain/repositories/IRevenueRepository';
import { Revenue } from '../../domain/entities/Revenue';

export class PostgresRevenueRepository implements IRevenueRepository {
    async findAll(): Promise<Revenue[]> {
        const result = await sql`SELECT * FROM revenue`;
        return result.rows as Revenue[];
    }

    async findByMonth(month: string): Promise<Revenue | null> {
        const result = await sql`
            SELECT * FROM revenue WHERE month = ${month}
        `;
        if (!result.rows[0]) return null;
        return result.rows[0] as Revenue;
    }
}