import { Customer } from '../entities/Customer';

export interface ICustomerRepository {
    findAll(): Promise<Customer[]>;
    findById(id: string): Promise<Customer | null>;
    findByQuery(query: string): Promise<Customer[]>;
    create(customer: Customer): Promise<Customer>;
    update(customer: Customer): Promise<Customer>;
}