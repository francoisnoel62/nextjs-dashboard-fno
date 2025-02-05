import { Revenue } from '../../entities/Revenue';
import { IRevenueRepository } from '../../repositories/IRevenueRepository';

export class FetchRevenueUseCase {
    constructor(private revenueRepository: IRevenueRepository) {}

    async execute(): Promise<Revenue[]> {
        try {
            return await this.revenueRepository.findAll();
        } catch (error) {
            console.error('Use Case Error:', error);
            throw new Error('Failed to fetch revenue data.');
        }
    }
}