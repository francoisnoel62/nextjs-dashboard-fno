'use server';

import { PostgresAttendeeRepository } from '@/src/infrastructure/repositories/PostgresAttendeeRepository';
import { FetchFilteredAttendeesUseCase } from '@/src/domain/useCases/presences/FetchFilteredAttendeesUseCase';
import { Attendee } from '@/src/domain/entities/Attendee';

export async function fetchFilteredAttendees(query: string, page: number): Promise<Attendee[]> {
  try {
    const repository = new PostgresAttendeeRepository();
    const useCase = new FetchFilteredAttendeesUseCase(repository);
    return await useCase.execute(query, page);
  } catch (error) {
    console.error('Error fetching attendees:', error);
    throw new Error('Failed to fetch filtered attendees');
  }
}

export async function fetchAttendeesPages(query: string): Promise<number> {
  try {
    const repository = new PostgresAttendeeRepository();
    const totalAttendees = await repository.getTotalAttendees(query);
    const ITEMS_PER_PAGE = 6;
    return Math.ceil(totalAttendees / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Error fetching total pages:', error);
    throw new Error('Failed to fetch total pages');
  }
}