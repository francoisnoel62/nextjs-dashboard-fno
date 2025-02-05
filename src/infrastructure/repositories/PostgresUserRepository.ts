import { sql } from '@vercel/postgres';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Profile } from '../../domain/entities/Profile';

export class PostgresUserRepository implements IUserRepository {
    async findById(id: string): Promise<Profile | null> {
        const result = await sql`
            SELECT * FROM profiles 
            WHERE user_id = ${id}
        `;
        if (!result.rows[0]) return null;
        return result.rows[0] as Profile;
    }


    async findByEmail(email: string): Promise<User | null> {
        const result = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        if (!result.rows[0]) return null;
        return result.rows[0] as User;
    }

    async create(user: User): Promise<User> {
        const result = await sql`
            INSERT INTO users (id, name, email, password)
            VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password})
            RETURNING *
        `;
        return result.rows[0] as User;
    }

    async update(user: User): Promise<User> {
        const result = await sql`
            UPDATE users
            SET name = ${user.name}, email = ${user.email}, password = ${user.password}
            WHERE id = ${user.id}
            RETURNING *
        `;
        return result.rows[0] as User;
    }
}