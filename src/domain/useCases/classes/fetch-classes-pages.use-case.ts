import { IClassRepository } from '../../repositories/IClassRepository';

export class FetchClassesPagesUseCase {
    constructor(private classRepository: IClassRepository) {}

    async execute(query: string): Promise<number> {
        try {
            return await this.classRepository.getPageCount(query);
        } catch (error) {
            console.error('Use Case Error:', error);
            throw new Error('Failed to fetch classes page count.');
        }
    }
}