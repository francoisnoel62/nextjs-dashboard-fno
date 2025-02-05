'use server';

import { auth } from '@/auth';
import { DeleteAttendeeUseCase } from '@/src/domain/useCases/presences/DeleteAttendeeUseCase';
import { PostgresAttendeeRepository } from '@/src/infrastructure/repositories/PostgresAttendeeRepository';
import { revalidatePath } from 'next/cache';
import { resend } from '@/lib/resend';
import { CancelBookingEmail } from '@/emails/CancelBooking';

export async function deleteAttendee(id: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'User not authenticated or invalid user ID' };
    }

    const attendeeRepository = new PostgresAttendeeRepository();
    const attendee = await attendeeRepository.findAndDelete(id);
    
    if (!attendee) {
      return { success: false, message: 'Attendee not found' };
    }

    // Envoyer l'email de manière asynchrone sans attendre sa complétion
    resend.emails.send({
      from: "do-not-answer@mydenzali.fr",
      to: 'info@denzali.ch',
      subject: 'Annulation de réservation',
      react: CancelBookingEmail({
        ...attendee,
      })
    }).catch(error => {
      console.error('Error sending cancellation email:', error);
      // Ne pas bloquer le processus en cas d'erreur d'envoi d'email
    });

    // Revalidate immediately after successful deletion
    revalidatePath('/dashboard/attendees');
    
    return { success: true, attendee };
  } catch (error) {
    console.error('Error in deleteAttendee:', error);
    return {
      success: false,
      message: 'An error occurred while deleting the attendee',
    };
  }
}
