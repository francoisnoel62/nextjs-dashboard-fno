import { sql } from '@vercel/postgres';
import { IInvoiceRepository } from '../../domain/repositories/IInvoiceRepository';
import { Invoice } from '../../domain/entities/Invoice';

const ITEMS_PER_PAGE = 6;

export class PostgresInvoiceRepository implements IInvoiceRepository {
    async findAll(): Promise<Invoice[]> {
        const result = await sql`SELECT * FROM invoices`;
        return result.rows as Invoice[];
    }

    async findById(id: string): Promise<Invoice | null> {
        const result = await sql`
            SELECT * FROM invoices WHERE id = ${id}
        `;
        if (!result.rows[0]) return null;
        return result.rows[0] as Invoice;
    }

    async findByCustomerId(customerId: string): Promise<Invoice[]> {
        const result = await sql`
            SELECT * FROM invoices WHERE customer_id = ${customerId}
        `;
        return result.rows as Invoice[];
    }

    async findLatest(): Promise<Invoice[]> {
        const result = await sql`
            SELECT invoices.*, customers.name, customers.email, customers.image_url
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            ORDER BY date DESC
            LIMIT 5
        `;
        return result.rows as Invoice[];
    }

    async findFiltered(query: string, page: number): Promise<Invoice[]> {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const result = await sql`
            SELECT 
                invoices.*, 
                customers.name, 
                customers.email, 
                customers.image_url
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            WHERE
                customers.name ILIKE ${`%${query}%`} OR
                customers.email ILIKE ${`%${query}%`} OR
                invoices.amount::text ILIKE ${`%${query}%`} OR
                invoices.date::text ILIKE ${`%${query}%`} OR
                invoices.status ILIKE ${`%${query}%`}
            ORDER BY invoices.date DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
        return result.rows as Invoice[];
    }

    async create(invoice: Invoice): Promise<Invoice> {
        const result = await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
            RETURNING *
        `;
        return result.rows[0] as Invoice;
    }

    async update(invoice: Invoice): Promise<Invoice> {
        const result = await sql`
            UPDATE invoices
            SET customer_id = ${invoice.customer_id},
                amount = ${invoice.amount},
                status = ${invoice.status}
            WHERE id = ${invoice.id}
            RETURNING *
        `;
        return result.rows[0] as Invoice;
    }

    async getPageCount(query: string): Promise<number> {
        const result = await sql`
            SELECT COUNT(*)
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            WHERE
                customers.name ILIKE ${`%${query}%`} OR
                customers.email ILIKE ${`%${query}%`} OR
                invoices.amount::text ILIKE ${`%${query}%`} OR
                invoices.date::text ILIKE ${`%${query}%`} OR
                invoices.status ILIKE ${`%${query}%`}
        `;
        const totalPages = Math.ceil(Number(result.rows[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    }
}