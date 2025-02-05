'use server'

import { PostgresAttendeeRepository } from "@/src/infrastructure/repositories/PostgresAttendeeRepository";
import { FetchFilteredAttendeesUseCase } from "@/src/domain/useCases/presences/FetchFilteredAttendeesUseCase";
import { FetchAttendeesPagesUseCase } from "@/src/domain/useCases/presences/FetchAttendeesPagesUseCase";

const attendeeRepository = new PostgresAttendeeRepository();

export async function fetchFilteredAttendees(query: string, currentPage: number) {
    const useCase = new FetchFilteredAttendeesUseCase(attendeeRepository);
    return useCase.execute(query, currentPage);
}

export async function fetchAttendeesPages(query: string) {
    const useCase = new FetchAttendeesPagesUseCase(attendeeRepository);
    return useCase.execute(query);
}