import {sql} from '@vercel/postgres';
import {
    CustomerField,
    CustomersTableType,
    InvoiceForm,
    InvoicesTable,
    LatestInvoiceRaw,
    User,
    Revenue,
    Classes, AttendeesTable,
} from './definitions';
import {formatCurrency} from './utils';
import {unstable_noStore as noStore} from "next/cache";
import { auth } from '@/auth';

export async function fetchRevenue() {
    // Add noStore() here to prevent the response from being cached.
    // This is equivalent to in fetch(..., {cache: 'no-store'}).
    noStore();

    try {
        const data = await sql<Revenue>`SELECT *
                                        FROM revenue`;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
}

export async function fetchLatestInvoices() {
    noStore();
    try {
        const data = await sql<LatestInvoiceRaw>`
            SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
            FROM invoices
                     JOIN customers ON invoices.customer_id = customers.id
            ORDER BY invoices.date DESC LIMIT 5`;

        const latestInvoices = data.rows.map((invoice) => ({
            ...invoice,
            amount: formatCurrency(invoice.amount),
        }));
        return latestInvoices;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    }
}

export async function fetchCardData() {
    noStore();
    try {
        // You can probably combine these into a single SQL query
        // However, we are intentionally splitting them to demonstrate
        // how to initialize multiple queries in parallel with JS.
        const nombre_classes_par_semaine = sql`SELECT nombre_classes_par_semaine
                                        FROM abonnements`;
        const date_echeance_abonnement = sql`
            SELECT TO_CHAR(date_de_debut_contrat + INTERVAL '365 days', 'YYYY-MM-DD') as date_echeance_abonnement 
            FROM abonnements`;
        const current_credits = sql`SELECT nombre_credits
                                         FROM carte_a_10
                                         WHERE status = 'true'`;
        const total_anciennes_cartes = sql`SELECT COUNT(*)
                                                FROM carte_a_10
                                                WHERE nombre_credits = 0`;

        const data = await Promise.all([
            nombre_classes_par_semaine,
            date_echeance_abonnement,
            current_credits,
            total_anciennes_cartes,
        ]);

        const nombre_classes_par_semaine_value = data[0].rows[0].nombre_classes_par_semaine;
        const date_echeance_abonnement_value = data[1].rows[0]?.date_echeance_abonnement 
            ? new Date(data[1].rows[0].date_echeance_abonnement) 
            : null;
        const current_credits_value = data[2].rows[0].nombre_credits;
        const total_anciennes_cartes_value = data[3].rows[0].count;

        return {
            nombre_classes_par_semaine_value,
            date_echeance_abonnement_value,
            current_credits_value,
            total_anciennes_cartes_value,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch card data.');
    }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
    query: string,
    currentPage: number,
) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const invoices = await sql<InvoicesTable>`
            SELECT invoices.id,
                   invoices.amount,
                   invoices.date,
                   invoices.status,
                   customers.name,
                   customers.email,
                   customers.image_url
            FROM invoices
                     JOIN customers ON invoices.customer_id = customers.id
            WHERE customers.name ILIKE ${`%${query}%`}
               OR
                customers.email ILIKE ${`%${query}%`}
               OR
                invoices.amount::text ILIKE ${`%${query}%`}
               OR
                invoices.date::text ILIKE ${`%${query}%`}
               OR
                invoices.status ILIKE ${`%${query}%`}
            ORDER BY invoices.date DESC
                LIMIT ${ITEMS_PER_PAGE}
            OFFSET ${offset}
        `;

        return invoices.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoices.');
    }
}

export async function fetchInvoicesPages(query: string) {
    noStore();
    try {
        const count = await sql`SELECT COUNT(*)
                                FROM invoices
                                         JOIN customers ON invoices.customer_id = customers.id
                                WHERE customers.name ILIKE ${`%${query}%`}
                                   OR
                                    customers.email ILIKE ${`%${query}%`}
                                   OR
                                    invoices.amount::text ILIKE ${`%${query}%`}
                                   OR
                                    invoices.date::text ILIKE ${`%${query}%`}
                                   OR
                                    invoices.status ILIKE ${`%${query}%`}
        `;

        const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of invoices.');
    }
}

export async function fetchInvoiceById(id: string) {
    noStore();
    try {
        const data = await sql<InvoiceForm>`
            SELECT invoices.id,
                   invoices.customer_id,
                   invoices.amount,
                   invoices.status
            FROM invoices
            WHERE invoices.id = ${id};
        `;

        const invoice = data.rows.map((invoice) => ({
            ...invoice,
            // Convert amount from cents to dollars
            amount: invoice.amount / 100,
        }));

        return invoice[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoice.');
    }
}

export async function fetchCustomers() {
    try {
        const data = await sql<CustomerField>`
            SELECT id,
                   name
            FROM customers
            ORDER BY name ASC
        `;

        const customers = data.rows;
        return customers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchFilteredCustomers(query: string) {
    noStore();
    try {
        const data = await sql<CustomersTableType>`
            SELECT customers.id,
                   customers.name,
                   customers.email,
                   customers.image_url,
                   COUNT(invoices.id)                                                         AS total_invoices,
                   SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
                   SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END)    AS total_paid
            FROM customers
                     LEFT JOIN invoices ON customers.id = invoices.customer_id
            WHERE customers.name ILIKE ${`%${query}%`}
               OR
                customers.email ILIKE ${`%${query}%`}
            GROUP BY customers.id, customers.name, customers.email, customers.image_url
            ORDER BY customers.name ASC
        `;

        const customers = data.rows.map((customer) => ({
            ...customer,
            total_pending: formatCurrency(customer.total_pending),
            total_paid: formatCurrency(customer.total_paid),
        }));

        return customers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer table.');
    }
}

export async function getUser(email: string) {
    try {
        const user = await sql`SELECT *
                               FROM users
                               WHERE email = ${email}`;
        return user.rows[0] as User;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function fetchClassesPages(query: string) {
    noStore();
    try {
        const count = await sql`SELECT COUNT(*)
                                FROM classe
                                         JOIN classetype ON classe.type_id = classetype.id
                                WHERE nom_de_la_classe ILIKE ${`%${query}%`}
                                   OR
                                    date_et_heure ::text ILIKE ${`%${query}%`}
        `;

        const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of classes.');
    }
}

export async function fetchFilteredClasses(query: string, currentPage: number) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const classes = await sql<Classes>`
            SELECT c.id,
                   c.nom_de_la_classe,
                   c.date_et_heure,
                   ct.type_name as type,
                   c.nombre_de_places_disponibles
            FROM classe c
                     JOIN classetype ct ON c.type_id = ct.id
            WHERE c.nom_de_la_classe ILIKE ${`%${query}%`}
               OR
                c.date_et_heure::text ILIKE ${`%${query}%`}
               OR
                ct.type_name ILIKE ${`%${query}%`}
            ORDER BY date_et_heure ASC
                LIMIT ${ITEMS_PER_PAGE}
            OFFSET ${offset}
        `;

        return classes.rows;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch classes table.');
    }
}


export async function fetchAttendeesPages(query: string) {
    noStore();
    try {
        const count = await sql`SELECT COUNT(*)
                                FROM attendees
        `;

        const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of attendees.');
    }
}

export async function fetchFilteredAttendees(query: string, currentPage: number) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'User not authenticated or ID not available' };
    }

    try {
        const attendees = await sql<AttendeesTable>`
            SELECT a.id,
                   a.classe_id,
                   c.nom_de_la_classe as classe_name,
                   c.date_et_heure as classe_date,
                   a.user_id,
                   u.name as user_name,
                   a.created_at as booking_date,
                   ct.type_name as classe_type
            FROM attendees a
                     JOIN classe c ON a.classe_id = c.id
                     JOIN users u ON a.user_id = u.id
                     JOIN classetype ct ON c.type_id = ct.id
            WHERE a.user_id = ${session.user.id}
               AND
                (c.nom_de_la_classe ILIKE ${`%${query}%`}
               OR
                u.name ILIKE ${`%${query}%`})
            ORDER BY c.date_et_heure ASC
                LIMIT ${ITEMS_PER_PAGE}
            OFFSET ${offset}
        `;

        return attendees.rows;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch attendees table.');
    }
}

export async function getClassTypes() {
    try {
        const { rows } = await sql<{ id: number, type: string }>`
            SELECT id, type_name as type 
            FROM classetype
            ORDER BY id ASC
        `;
        return rows;
    } catch (error) {
        console.error('Failed to fetch class types:', error);
        throw new Error('Failed to fetch class types.');
    }
}

export async function fetchProfileByUserId(userId: string) {
    try {
        const data = await sql`
            SELECT first_name, last_name, address, telephone, 
                   TO_CHAR(date_of_birth, 'YYYY-MM-DD') as date_of_birth
            FROM profiles 
            WHERE user_id = ${userId}
        `;
        return data.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch profile data.');
    }
}
