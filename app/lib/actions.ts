'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { use } from 'react';
import { UUID } from 'crypto';
import { auth } from "@/auth"



const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const ClassesShema = z.object({
    id: z.string(),
    nom_de_la_classe: z.string(),
    type_id: z.number(),
    date_et_heure: z.string(),
    nombre_de_places: z.number(),
});

const CreateClass = ClassesShema.omit({ id: true });
const UpdateClass = ClassesShema.omit({ id: true });

export async function updateInvoice(id: string, formData: FormData):Promise<void> {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (e) {
        console.error(e);
        throw new Error('An error occurred while updating the invoice');
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function createInvoice(formData: FormData): Promise<void> {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = Math.round(amount * 100);
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (e) {
        throw new Error('An error occurred while creating the invoice');
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

    try {
        await sql`
            DELETE FROM invoices
            WHERE id = ${id}
        `;
        revalidatePath('/dashboard/invoices');
        return { message: 'Invoice deleted successfully' };
    } catch (e) {
        return {
            message: 'An error occurred while deleting the invoice',
        }
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
): Promise<string | undefined> {
    try {
        await signIn('credentials', Object.fromEntries(formData));
        return undefined; // Successful login
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

const RegisterUser = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
});

export async function register(
    prevState: string | null,
    formData: FormData,
): Promise<string | null> {

    const validatedFields = RegisterUser.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirm-password'),
    });
    if (!validatedFields.success) {
        return "Missing fields. Failed to register.";
    }

    const { name, email, password, confirmPassword } = validatedFields.data;

    if (password !== confirmPassword) {
        return "Passwords don't match. Failed to register.";
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const id = uuidv4()

    try {
        await sql`
            INSERT INTO users (id, name, email, password)
            VALUES (${id}, ${name}, ${email}, ${hashedPassword})
        `;
    } catch (e) {
        return "Failed to register. Please try again.";
    }

    redirect('/login');
}

export async function deleteClass(id: number) {

    try {
        await sql`
            DELETE FROM classe
            WHERE id = ${id}
        `;
        revalidatePath('/dashboard/classes');
        return { message: 'Class deleted successfully' };
    } catch (e) {
        return {
            message: 'An error occurred while deleting the class',
        }
    }
}

export async function createClass(formData: FormData) {
    const { nom_de_la_classe, date_et_heure, type_id, nombre_de_places } = CreateClass.parse({
        nom_de_la_classe: formData.get('nom_de_la_classe'),
        date_et_heure: formData.get('date_et_heure'),
        type_id: formData.get('type_id'),
        nombre_de_places: formData.get('nombre_de_places'),
    });

    try {
        await sql`
            INSERT INTO classe (nom_de_la_classe, date_et_heure, type_id, nombre_de_places)
            VALUES (${nom_de_la_classe}, ${date_et_heure}, ${type_id}, ${nombre_de_places})
        `;
    } catch (e) {
        return {
            message: 'An error occurred while creating the class',
        }
    }

    revalidatePath('/dashboard/classes');
    redirect('/dashboard/classes');
}

export async function updateClass(id: string, formData: FormData) {
    const { nom_de_la_classe, type_id, date_et_heure, nombre_de_places } = UpdateClass.parse({
        nom_de_la_classe: formData.get('nom_de_la_classe'),
        type_id: formData.get('type_id'),
        date_et_heure: formData.get('date_et_heure'),
        nombre_de_places: formData.get('nombre_de_places'),
    });

    try {
        await sql`
            UPDATE classe
            SET nom_de_la_classe = ${nom_de_la_classe}, type_id = ${type_id}, date_et_heure = ${date_et_heure}, nombre_de_places = ${nombre_de_places}
            WHERE id = ${id}
        `;
    } catch (e) {
        return {
            message: 'An error occurred while updating the class',
        }
    }

    revalidatePath('/dashboard/classes');
    redirect('/dashboard/classes');
}

export async function deleteAttendee(id: string) {

    try {
        await sql`
            DELETE FROM attendees
            WHERE id = ${id}
        `;
        return { message: 'Attendee deleted successfully' };
    } catch (e) {
        return {
            message: 'An error occurred while deleting the attendee',
        }
    }
}


export async function addPresence(classe_id: number) {
    const session = await auth();

    if (!session?.user?.id) {
        return { message: 'User not authenticated or ID not available' };
    }

    // Check if the user is already attending the class
    const existingAttendee = await sql`
        SELECT * FROM attendees
        WHERE classe_id = ${classe_id} AND user_id = ${session.user.id}
    `;
    if (existingAttendee?.rowCount && existingAttendee.rowCount > 0) {
        return { message: 'You are already attending this class' };
    } else {
        try {
            await sql`
                INSERT INTO attendees (classe_id, user_id)
                VALUES (${classe_id}, ${session.user.id})
                ON CONFLICT (classe_id, user_id) DO NOTHING
            `;
            return { message: 'Presence added successfully' };
        } catch (e) {
            console.error(e);
            return {
                message: 'An error occurred while adding the presence',
            };
        }
    }
}