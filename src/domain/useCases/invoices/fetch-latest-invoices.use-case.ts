import { IInvoiceRepository } from '../../repositories/IInvoiceRepository';
import { Invoice } from '../../entities/Invoice';

export class FetchLatestInvoicesUseCase {
    constructor(private invoiceRepository: IInvoiceRepository) {}

    async execute(): Promise<Invoice[]> {
        try {
            return await this.invoiceRepository.findLatest();
        } catch (error) {
            console.error('Use Case Error:', error);
            throw new Error('Failed to fetch the latest invoices.');
        }
    }
}