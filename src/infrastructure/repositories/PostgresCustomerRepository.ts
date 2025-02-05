import { sql } from '@vercel/postgres';
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';
import { Customer } from '../../domain/entities/Customer';

export class PostgresCustomerRepository implements ICustomerRepository {
    async findAll(): Promise<Customer[]> {
        const result = await sql`SELECT * FROM customers`;
        return result.rows as Customer[];
    }

    async findById(id: string): Promise<Customer | null> {
        const result = await sql`
            SELECT * FROM customers WHERE id = ${id}
        `;
        if (!result.rows[0]) return null;
        return result.rows[0] as Customer;
    }

    async findByQuery(query: string): Promise<Customer[]> {
        const result = await sql`
            SELECT *
            FROM customers
            WHERE name ILIKE ${`%${query}%`} OR
                  email ILIKE ${`%${query}%`}
            ORDER BY name ASC
        `;
        return result.rows as Customer[];
    }

    async create(customer: Customer): Promise<Customer> {
        const result = await sql`
            INSERT INTO customers (id, name, email, image_url)
            VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
            RETURNING *
        `;
        return result.rows[0] as Customer;
    }

    async update(customer: Customer): Promise<Customer> {
        const result = await sql`
            UPDATE customers
            SET name = ${customer.name},
                email = ${customer.email},
                image_url = ${customer.image_url}
            WHERE id = ${customer.id}
            RETURNING *
        `;
        return result.rows[0] as Customer;
    }
}