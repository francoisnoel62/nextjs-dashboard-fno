import { PostgresAttendeeRepository } from "@/src/infrastructure/repositories/PostgresAttendeeRepository";
import { Attendee } from "../../entities/Attendee";

export class FetchFilteredAttendeesUseCase {
    constructor(private attendeeRepo: PostgresAttendeeRepository) {}
    
    execute(query: string, page: number): Promise<Attendee[]> {
      return this.attendeeRepo.fetchFiltered(query, page);
    }
  }