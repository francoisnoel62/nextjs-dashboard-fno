'use server';

import { auth } from '@/auth';
import { DeleteAttendeeUseCase } from '@/src/domain/useCases/DeleteAttendeeUseCase';
import { AddPresenceUseCase } from '@/src/domain/useCases/AddPresenceUseCase';
import { PostgresAttendeeRepository } from '@/src/infrastructure/repositories/PostgresAttendeeRepository';
import { PostgresClassRepository } from '@/src/infrastructure/repositories/PostgresClassRepository';
import { revalidatePath } from 'next/cache';

export async function deleteAttendee(id: string) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return { message: 'User not authenticated or invalid user ID' };
    }

    const user_id = session.user.id;

    // Initialize repository
    const attendeeRepository = new PostgresAttendeeRepository();

    // Initialize use case
    const deleteAttendeeUseCase = new DeleteAttendeeUseCase(attendeeRepository);

    // Execute use case
    const result = await deleteAttendeeUseCase.execute(id);

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

export async function determineProductType(user_id: string, classe_id: number): Promise<'abonnement' | 'carte a 10'> {
  const attendeeRepository = new PostgresAttendeeRepository();
  const classRepository = new PostgresClassRepository();
  const addPresenceUseCase = new AddPresenceUseCase(attendeeRepository, classRepository);

  return addPresenceUseCase.determineProductType(user_id, classe_id);
}

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
