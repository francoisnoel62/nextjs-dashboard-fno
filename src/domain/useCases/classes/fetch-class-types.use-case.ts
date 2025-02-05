import { IClassRepository } from '../../repositories/IClassRepository';
import { ClassType } from '../../entities/ClassType';

export class FetchClassTypesUseCase {
    constructor(private classRepository: IClassRepository) {}

    async execute(): Promise<ClassType[]> {
        try {
            return await this.classRepository.getTypes();
        } catch (error) {
            console.error('Use Case Error:', error);
            throw new Error('Failed to fetch class types.');
        }
    }
}