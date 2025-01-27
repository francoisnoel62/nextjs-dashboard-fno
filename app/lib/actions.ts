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
    nombre_de_places_disponibles: z.number(),
});

// const CreateClass = ClassesShema.omit({ id: true });
const CreateClass = z.object({
    nom_de_la_classe: z.string(),
    date_et_heure: z.string(),
    type_id: z.string().transform((val) => parseInt(val, 10)),
    nombre_de_places_disponibles: z.string().transform((val) => parseInt(val, 10))
});
const UpdateClass = z.object({
    nom_de_la_classe: z.string(),
    type_id: z.string().transform((val) => parseInt(val, 10)),
    date_et_heure: z.string(),
    nombre_de_places_disponibles: z.string().transform((val) => parseInt(val, 10))
});

export async function updateInvoice(id: string, formData: FormData): Promise<void> {
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

export async function createClass(formData: FormData): Promise<void> {
    console.log('formData: ', formData);
    const { nom_de_la_classe, date_et_heure, type_id, nombre_de_places_disponibles } = CreateClass.parse({
        nom_de_la_classe: formData.get('classe'),
        date_et_heure: formData.get('date'),
        type_id: formData.get('typeId'),
        nombre_de_places_disponibles: formData.get('seats'),
    });

    try {
        await sql`
            INSERT INTO classe (nom_de_la_classe, date_et_heure, type_id, nombre_de_places_disponibles)
            VALUES (${nom_de_la_classe}, ${date_et_heure}, ${type_id}, ${nombre_de_places_disponibles})
        `;
    } catch (e) {
        throw new Error('An error occurred while creating the class');
    }

    revalidatePath('/dashboard/classes');
    redirect('/dashboard/classes');
}

export async function updateClass(id: string, formData: FormData) {
    const { nom_de_la_classe, type_id, date_et_heure, nombre_de_places_disponibles } = UpdateClass.parse({
        nom_de_la_classe: formData.get('nom_de_la_classe'),
        type_id: formData.get('type_id'),
        date_et_heure: formData.get('date_et_heure'),
        nombre_de_places_disponibles: formData.get('nombre_de_places_disponibles'),
    });

    try {
        await sql`
            UPDATE classe
            SET nom_de_la_classe = ${nom_de_la_classe}, type_id = ${type_id}, date_et_heure = ${date_et_heure}, nombre_de_places_disponibles = ${nombre_de_places_disponibles}
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
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'User not authenticated or ID not available' };
    }
    const profile = await sql`
        SELECT id FROM profiles
        WHERE user_id = ${session.user.id}
    `;
    const profile_id = profile.rows[0].id;
    try {
        // Get attendee details including product type and user_id
        const attendee = await sql`
            SELECT classe_id, product, user_id FROM attendees
            WHERE id = ${id}
        `;
        const { classe_id, product, user_id } = attendee.rows[0];

        // If product is 'carte à 10', increment credits
        if (product === 'carte à 10') {
            await sql`
                UPDATE carte_a_10
                SET nombre_credits = nombre_credits + 1
                WHERE profile_id = ${profile_id} AND status = true
            `;
        }

        // Update the class slots
        await sql`
            UPDATE classe
            SET nombre_de_places_disponibles = nombre_de_places_disponibles + 1
            WHERE id = ${classe_id}
        `;

        // Delete the attendee
        await sql`
            DELETE FROM attendees
            WHERE id = ${id}
        `;

        revalidatePath('/dashboard/attendees');
        return { message: 'Attendee deleted successfully' };
    } catch (e) {
        console.error(e);
        return {
            message: 'An error occurred while deleting the attendee',
        }
    }
}


export async function addPresence(classe_id: number) {
    try {
        // Authenticate user and get user ID
        const session = await auth();
        const user_id = session?.user?.id;
        if (!user_id) {
            return { message: 'User not authenticated or ID not available' };
        }

        // Check if user is already attending the class
        const isAlreadyAttending = await sql`
            SELECT id FROM attendees
            WHERE classe_id = ${classe_id} AND user_id = ${user_id}
        `;
        if (isAlreadyAttending.rowCount && isAlreadyAttending.rows[0].id > 0) {
            return { message: 'You are already attending this class' };
        }

        // Check if the class has available slots
        const classAvailability = await sql`
            SELECT nombre_de_places_disponibles FROM classe
            WHERE id = ${classe_id}
        `;
        if (classAvailability.rowCount === 0 || classAvailability.rows[0].nombre_de_places_disponibles <= 0) {
            return { message: 'Class is full' };
        }

        // Fetch user profile ID
        const profile = await sql`
            SELECT id FROM profiles
            WHERE user_id = ${user_id}
        `;
        const profile_id = profile.rows[0]?.id;
        if (!profile_id) {
            return { message: 'Profile not found' };
        }

        // Check user's abonnement and carte_a_10
        const abonnement = await sql`
            SELECT a.id, a.used_credits_this_week,
                   c1.nom_de_la_classe as default_classe_1_name,
                   c2.nom_de_la_classe as default_classe_2_name
            FROM abonnements a
            LEFT JOIN classe c1 ON a.default_classe_1 = c1.id
            LEFT JOIN classe c2 ON a.default_classe_2 = c2.id
            WHERE a.profile_id = ${profile_id}
        `;
        const carte_a_10 = await sql`
            SELECT id, nombre_credits
            FROM carte_a_10
            WHERE status = 'true'
            AND profile_id = ${profile_id}
        `;

        // Get the current class name
        const currentClass = await sql`
            SELECT nom_de_la_classe
            FROM classe
            WHERE id = ${classe_id}
        `;
        const currentClassName = currentClass.rows[0]?.nom_de_la_classe;

        const abonnement_id = abonnement.rows[0]?.id;
        const carte_a_10_id = carte_a_10.rows[0]?.id;
        const isDefaultClass =
            abonnement.rows[0]?.default_classe_1_name === currentClassName ||
            abonnement.rows[0]?.default_classe_2_name === currentClassName;
        
        console.log("isDefaultClass: ", isDefaultClass);
        console.log("abonnement_id: ", abonnement_id);
        console.log("carte_a_10_id: ", carte_a_10_id);
        console.log("abonnement.rows[0]?.default_classe_1_name: ", abonnement.rows[0]?.default_classe_1_name);
        console.log("abonnement.rows[0]?.default_classe_2_name: ", abonnement.rows[0]?.default_classe_2_name);
        console.log("currentClassName: ", currentClassName);

        if (isDefaultClass && abonnement_id) {
            // Use abonnement
            await addAttendee(classe_id, user_id, 'abonnement');
            await updateClassSlots(classe_id);
            await updateUsedCreditsThisWeek(abonnement_id);
        } else if (carte_a_10_id && carte_a_10.rows[0]?.nombre_credits > 0) {
            // Use carte_a_10
            await addAttendee(classe_id, user_id, 'carte à 10');
            await updateClassSlots(classe_id);
            await updateNombreCredits(carte_a_10_id);
            console.log('carte à 10');
        } else {
            return { message: 'You are not authorized to attend this class' };
        }

        revalidatePath('/dashboard/classes');
        return { message: 'Presence added successfully' };
    } catch (error) {
        console.error(error);
        return { message: 'An error occurred while adding the presence' };
    }
}

async function updateNombreCredits(carte_a_10_id: any) {
    await sql`
                UPDATE carte_a_10
                SET nombre_credits = nombre_credits - 1
                WHERE id = ${carte_a_10_id}
            `;
    console.log('carte à 10 updated');
}

async function updateUsedCreditsThisWeek(abonnement_id: any) {
    await sql`
                UPDATE abonnements
                SET used_credits_this_week = used_credits_this_week + 1
                WHERE id = ${abonnement_id}
            `;
    console.log('used credits this week updated');
}

// Helper function to add attendee
async function addAttendee(classe_id: number, user_id: string, product: string) {
    await sql`
        INSERT INTO attendees (classe_id, user_id, product)
        VALUES (${classe_id}, ${user_id}, ${product})
        ON CONFLICT (classe_id, user_id) DO NOTHING
    `;
    console.log('attendee added');
}

// Helper function to update class slots
async function updateClassSlots(classe_id: number) {
    await sql`
        UPDATE classe
        SET nombre_de_places_disponibles = nombre_de_places_disponibles - 1
        WHERE id = ${classe_id}
    `;
    console.log('class slot updated');
}


// Add Profile schema
const ProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  telephone: z.string().min(1, 'Telephone is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
});

export async function createOrUpdateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const validatedFields = ProfileSchema.safeParse({
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    address: formData.get('address'),
    telephone: formData.get('telephone'),
    date_of_birth: formData.get('date_of_birth'),
  });

  if (!validatedFields.success) {
    throw new Error('Invalid form data');
  }

  const { first_name, last_name, address, telephone, date_of_birth } = validatedFields.data;
  const userId = session.user.id;

  try {
    const existingProfile = await sql`
      SELECT id FROM profiles WHERE user_id = ${userId}
    `;

    if (existingProfile.rows.length > 0) {
      await sql`
        UPDATE profiles
        SET first_name = ${first_name},
            last_name = ${last_name},
            address = ${address},
            telephone = ${telephone},
            date_of_birth = ${date_of_birth}::date,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
      `;
    } else {
      await sql`
        INSERT INTO profiles (user_id, first_name, last_name, address, telephone, date_of_birth)
        VALUES (${userId}, ${first_name}, ${last_name}, ${address}, ${telephone}, ${date_of_birth}::date)
      `;
    }

    revalidatePath('/dashboard/profil');
  } catch (error) {
    console.error('Profile save error:', error);
    throw new Error('Failed to save profile.');
  }

  redirect('/dashboard/profil');
}
