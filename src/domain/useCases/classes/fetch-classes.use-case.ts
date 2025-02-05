import { IClassRepository } from '../../repositories/IClassRepository';
import { Class } from '../../entities/Class';

export class FetchClassesUseCase {
    constructor(private classRepository: IClassRepository) {}

    async execute(): Promise<Class[]> {
        try {
            return await this.classRepository.findAll();
        } catch (error) {
            console.error('Use Case Error:', error);
            throw new Error('Failed to fetch classes.');
        }
    }
}