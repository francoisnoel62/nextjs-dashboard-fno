import { FetchRevenueUseCase } from '../revenues/fetch-revenue.use-case';
import { FetchLatestInvoicesUseCase } from '../invoices/fetch-latest-invoices.use-case';
import { FetchFilteredInvoicesUseCase } from '../invoices/fetch-filtered-invoices.use-case';
import { FetchFilteredCustomersUseCase } from '../customers/fetch-filtered-customers.use-case';
import { GetUserProfileUseCase } from '../users/get-user-profile.use-case';
import { FetchCardDataUseCase } from '../subscriptions/fetch-card-data.use-case';

export class DashboardFacade {
    constructor(
        private fetchRevenueUseCase: FetchRevenueUseCase,
        private fetchLatestInvoicesUseCase: FetchLatestInvoicesUseCase,
        private fetchFilteredInvoicesUseCase: FetchFilteredInvoicesUseCase,
        private fetchFilteredCustomersUseCase: FetchFilteredCustomersUseCase,
        private getUserProfileUseCase: GetUserProfileUseCase,
        private fetchCardDataUseCase: FetchCardDataUseCase
    ) {}

    async fetchRevenue() {
        return this.fetchRevenueUseCase.execute();
    }

    async fetchLatestInvoices() {
        return this.fetchLatestInvoicesUseCase.execute();
    }

    async fetchFilteredInvoices(query: string, currentPage: number) {
        return this.fetchFilteredInvoicesUseCase.execute(query, currentPage);
    }

    async fetchFilteredCustomers(query: string) {
        return this.fetchFilteredCustomersUseCase.execute(query);
    }

    async getUserProfile(email: string) {
        return this.getUserProfileUseCase.execute(email);
    }

    async fetchCardData() {
        return this.fetchCardDataUseCase.execute();
    }
}