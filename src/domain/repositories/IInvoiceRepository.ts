import { Invoice } from '../entities/Invoice';

export interface IInvoiceRepository {
    findAll(): Promise<Invoice[]>;
    findById(id: string): Promise<Invoice | null>;
    findByCustomerId(customerId: string): Promise<Invoice[]>;
    findLatest(): Promise<Invoice[]>;
    findFiltered(query: string, page: number): Promise<Invoice[]>;
    create(invoice: Invoice): Promise<Invoice>;
    update(invoice: Invoice): Promise<Invoice>;
    getPageCount(query: string): Promise<number>;
}