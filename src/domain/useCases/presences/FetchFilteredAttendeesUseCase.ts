import { Attendee } from "../../entities/Attendee";
import { IAttendeeRepository } from "../../repositories/IAttendeeRepository";

export class FetchFilteredAttendeesUseCase {
    constructor(private attendeeRepo: IAttendeeRepository) {}
    
    async execute(query: string, page: number): Promise<Attendee[]> {
      try {
        return await this.attendeeRepo.fetchFiltered(query, page);
      } catch (error) {
        console.error('Use Case Error:', error);
        throw new Error('Failed to fetch filtered attendees.');
      }
    }
  }