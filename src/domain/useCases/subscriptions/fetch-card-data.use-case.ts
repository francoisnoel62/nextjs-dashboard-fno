import { IAttendeeRepository } from '@/src/domain/repositories/IAttendeeRepository';
import { auth } from '@/auth';
import { PostgresAttendeeRepository } from '@/src/infrastructure/repositories/PostgresAttendeeRepository';

export class FetchCardDataUseCase {
    constructor(private attendeeRepository: IAttendeeRepository) {}

    async execute() {
        // Get the current user session
        const session = await auth();
        if (!session?.user?.email) {
            throw new Error('User not authenticated');
        }

        // Get user profile
        const userProfile = await this.attendeeRepository.getUserProfile(session.user.id ?? '');
        if (!userProfile) {
            return {
                nombre_classes_par_semaine_value: '',
                jour_abonnement_value: '',
                date_echeance_abonnement_value: '',
                current_credits_value: '',
                total_anciennes_cartes_value: ''
            };
        }

        // Get user subscription
        const subscription = await this.attendeeRepository.getUserSubscription(userProfile.id);
        const defaultClasses = subscription 
            ? [subscription.default_classe_1_nom_de_la_classe, subscription.default_classe_2_nom_de_la_classe]
                .filter(Boolean)
                .join(', ')
            : '';

        // Get subscription day of week if available
        let dayOfWeek = '';
        if (subscription?.default_classe_1_nom_de_la_classe) {
            const classInfo = await this.attendeeRepository.getClassDayOfWeek(subscription.id);
            dayOfWeek = classInfo?.nom_de_la_classe || '';
        }

        // Get user carte (for credits)
        const carte = await this.attendeeRepository.getUserCarte(userProfile.id);
        
        return {
            nombre_classes_par_semaine_value: defaultClasses,
            jour_abonnement_value: dayOfWeek,
            date_echeance_abonnement_value: subscription ? subscription.id.toString() : '',
            current_credits_value: carte ? carte.id.toString() : '',
            total_anciennes_cartes_value: '' // This might need to be implemented if there's a way to track historical cards
        };
    }
}

// Export a singleton instance of the use case
export async function fetchCardData() {
    
    const attendeeRepository = new PostgresAttendeeRepository();
    const useCase = new FetchCardDataUseCase(attendeeRepository);
    
    return useCase.execute();
}
