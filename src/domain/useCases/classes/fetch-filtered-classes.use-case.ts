import { IClassRepository } from '../../repositories/IClassRepository';
import { Class } from '../../entities/Class';

export class FetchFilteredClassesUseCase {
    constructor(private classRepository: IClassRepository) {}

    async execute(query: string, currentPage: number): Promise<Class[]> {
        try {
            return await this.classRepository.findFiltered(query, currentPage);
        } catch (error) {
            console.error('Use Case Error:', error);
            throw new Error('Failed to fetch filtered classes.');
        }
    }
}