import { auth } from "@/auth";
import KoalaWelcomeEmail from "@/emails/NewBooking";
import { resend } from "@/lib/resend";
import { PostgresAttendeeRepository } from "@/src/infrastructure/repositories/PostgresAttendeeRepository";
import { revalidatePath } from "next/cache";
import { determineProductType } from "./determineProductType";


export async function createAttendee(classe_id: number) {
    try {
      // Authenticate user
      const session = await auth();
      if (!session?.user?.id) {
        return { message: 'User not authenticated or invalid user ID' };
      }
  
      const user_id = session.user.id;
      const attendeeRepository = new PostgresAttendeeRepository();
  
      // Get user profile first
      const profile = await attendeeRepository.getUserProfile(user_id);
      if (!profile) {
        return { message: 'User profile not found' };
      }
  
      // Check if user already has a reservation for this class
      const existingAttendee = await attendeeRepository.findByClassAndUser(classe_id, user_id);
      if (existingAttendee) {
        return { message: 'You already have a reservation for this class' };
      }
  
      // Determine which product to use based on subscription status and class day
      const product = await determineProductType(user_id, classe_id);
  
      // Create the attendee with the determined product
      const attendee = await attendeeRepository.create({
        classe_id,
        user_id,
        product
      });
  
      // Send booking confirmation email
      try {
        await resend.emails.send({
          from: "do-not-answer@mydenzali.fr",
          to: 'info@denzali.ch',
          subject: 'Nouvelle réservation',
          react: KoalaWelcomeEmail({
            ...attendee,
            // formattedDate: atendee_classe_date
          })
        });
      } catch (err) {
        console.error('Error sending booking confirmation email:', err);
        // Continue execution even if email fails
      }
  
      // Update credits based on product type
      if (product === 'abonnement') {
        const subscription = await attendeeRepository.getUserSubscription(profile.id);
        if (subscription) {
          await attendeeRepository.updateUsedCredits(subscription.id);
        }
      } else {
        const carte = await attendeeRepository.getUserCarte(profile.id);
        if (carte) {
          await attendeeRepository.updateCarteCredits(carte.id);
        }
      }
  
      // Revalidate relevant pages
      revalidatePath('/dashboard/classes');
      revalidatePath('/dashboard/attendees');
  
      return { success: true, message: `Reservation created using ${product}` };
    } catch (error) {
      console.error('Error in createAttendee:', error);
      return {
        success: false,
        message: 'An error occurred while creating the reservation',
      };
    }
  }