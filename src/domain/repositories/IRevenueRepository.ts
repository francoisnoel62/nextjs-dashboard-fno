import { Revenue } from '../entities/Revenue';

export interface IRevenueRepository {
    findAll(): Promise<Revenue[]>;
    findByMonth(month: string): Promise<Revenue | null>;
}