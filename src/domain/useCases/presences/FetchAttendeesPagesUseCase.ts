import { IAttendeeRepository } from "../../repositories/IAttendeeRepository";

export class FetchAttendeesPagesUseCase {
    constructor(private attendeeRepo: IAttendeeRepository) {}

    async execute(query: string): Promise<number> {
        const count = await this.attendeeRepo.getFilteredAttendeesCount(query);
        const ITEMS_PER_PAGE = 6;
        return Math.ceil(count / ITEMS_PER_PAGE);
    }
}