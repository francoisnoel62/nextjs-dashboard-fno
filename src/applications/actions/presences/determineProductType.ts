import { AddPresenceUseCase } from "@/src/domain/useCases/presences/AddPresenceUseCase";
import { PostgresAttendeeRepository } from "@/src/infrastructure/repositories/PostgresAttendeeRepository";
import { PostgresClassRepository } from "@/src/infrastructure/repositories/PostgresClassRepository";

export async function determineProductType(user_id: string, classe_id: number): Promise<'abonnement' | 'carte à 10'> {
    const attendeeRepository = new PostgresAttendeeRepository();
    const classRepository = new PostgresClassRepository();
    const addPresenceUseCase = new AddPresenceUseCase(attendeeRepository, classRepository);
  
    return addPresenceUseCase.determineProductType(user_id, classe_id);
  }