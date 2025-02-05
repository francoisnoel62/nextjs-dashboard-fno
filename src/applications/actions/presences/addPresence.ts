'use server';

import { auth } from '@/auth';
import { AddPresenceUseCase } from '@/src/domain/useCases/presences/AddPresenceUseCase';
import { PostgresAttendeeRepository } from '@/src/infrastructure/repositories/PostgresAttendeeRepository';
import { PostgresClassRepository } from '@/src/infrastructure/repositories/PostgresClassRepository';
import { revalidatePath } from 'next/cache';

export async function addPresence(classe_id: number) {
  try {
    // Authenticate user and get user ID
    const session = await auth();
    const user_id = session?.user?.id;
    
    if (!user_id) {
      return { message: 'User not authenticated or ID not available' };
    }

    // Initialize repositories
    const attendeeRepository = new PostgresAttendeeRepository();
    const classRepository = new PostgresClassRepository();

    // Initialize use case
    const addPresenceUseCase = new AddPresenceUseCase(
      attendeeRepository,
      classRepository
    );

    // Execute use case
    const result = await addPresenceUseCase.execute(classe_id, user_id);

    // Revalidate the page to show updated data
    revalidatePath('/dashboard/classes');
    
    return result;
  } catch (error) {
    console.error('Error in addPresence:', error);
    return {
      message: 'An error occurred while adding the presence',
    };
  }
}
