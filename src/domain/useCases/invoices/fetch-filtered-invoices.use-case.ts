import { IInvoiceRepository } from '../../repositories/IInvoiceRepository';
import { Invoice } from '../../entities/Invoice';

export class FetchFilteredInvoicesUseCase {
    constructor(private invoiceRepository: IInvoiceRepository) {}

    async execute(query: string, currentPage: number): Promise<Invoice[]> {
        try {
            return await this.invoiceRepository.findFiltered(query, currentPage);
        } catch (error) {
            console.error('Use Case Error:', error);
            throw new Error('Failed to fetch filtered invoices.');
        }
    }
}