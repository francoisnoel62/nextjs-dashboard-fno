'use server';

import { auth } from '@/auth';
import { DeleteAttendeeUseCase } from '@/src/domain/useCases/presences/DeleteAttendeeUseCase';
import { PostgresAttendeeRepository } from '@/src/infrastructure/repositories/PostgresAttendeeRepository';
import { revalidatePath } from 'next/cache';
import { resend } from '@/lib/resend';
import { KoalaWelcomeEmail } from '@/emails/NewBooking';
import { CancelBookingEmail } from '@/emails/CancelBooking';

export async function deleteAttendee(id: number) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return { message: 'User not authenticated or invalid user ID' };
    }

    const user_id = session.user.id;

    // Initialize repository
    const attendeeRepository = new PostgresAttendeeRepository();

    // Get attendee details before deletion for email
    const attendee = await attendeeRepository.findById(id);
    if (!attendee) {
      return { message: 'Attendee not found' };
    }

    // Initialize use case
    const deleteAttendeeUseCase = new DeleteAttendeeUseCase(attendeeRepository);
    // const getFormattedAttendeeClasseDateUseCase = new GetFormattedAttendeeClasseDateUseCase(attendeeRepository);

    // Execute use case
    const result = await deleteAttendeeUseCase.execute(id);

    // const atendee_classe_date = await getFormattedAttendeeClasseDateUseCase.execute(attendee.id);

    // Send cancellation email
    try {
      await resend.emails.send({
        from: "do-not-answer@mydenzali.fr",
        to: 'info@denzali.ch',
        subject: 'Annulation de réservation',
        react: CancelBookingEmail({
          ...attendee,
          // formattedDate: atendee_classe_date
        })
      });
    } catch (emailError) {
      console.error('Error sending cancellation email:', emailError);
      // Continue execution even if email fails
    }

    // Revalidate the pages that might show attendee data
    revalidatePath('/dashboard/classes');
    revalidatePath('/dashboard/attendees');

    return { success: true };
  } catch (error) {
    console.error('Error in deleteAttendee:', error);
    return {
      success: false,
      message: 'An error occurred while deleting the attendee',
    };
  }
}


