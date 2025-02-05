import { ICustomerRepository } from '../../repositories/ICustomerRepository';
import { Customer } from '../../entities/Customer';

export class FetchFilteredCustomersUseCase {
    constructor(private customerRepository: ICustomerRepository) {}

    async execute(query: string): Promise<Customer[]> {
        try {
            return await this.customerRepository.findByQuery(query);
        } catch (error) {
            console.error('Use Case Error:', error);
            throw new Error('Failed to fetch filtered customers.');
        }
    }
}