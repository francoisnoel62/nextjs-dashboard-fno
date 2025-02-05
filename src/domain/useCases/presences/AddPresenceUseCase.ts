import { IAttendeeRepository } from '../../repositories/IAttendeeRepository';
import { IClassRepository } from '../../repositories/IClassRepository';

export class AddPresenceUseCase {
  constructor(
    private attendeeRepository: IAttendeeRepository,
    private classRepository: IClassRepository
  ) {}

  async determineProductType(user_id: string, classe_id: number): Promise<'abonnement' | 'carte à 10'> {
    // 1. Get user profile
    const profile = await this.attendeeRepository.getUserProfile(user_id);
    if (!profile) {
      throw new Error('User profile not found');
    }

    // 2. Check if user has an active subscription using profile_id
    const subscription = await this.attendeeRepository.getUserSubscription(profile.id);
    if (!subscription) {
      return 'carte à 10';
    }
    console.log("subscription:", subscription);

    // 3. Get class info
    const classInfo = await this.attendeeRepository.getClassInfo(classe_id);
    if (!classInfo) {
      throw new Error('Class not found');
    }

    // 4. Check if class name matches subscription default classes
    if (classInfo.nom_de_la_classe === subscription.default_classe_1_nom_de_la_classe || 
        classInfo.nom_de_la_classe === subscription.default_classe_2_nom_de_la_classe) {
      return 'abonnement';
    }

    return 'carte à 10';
  }

  async execute(classe_id: number, user_id: string): Promise<{ message: string }> {
    try {
      // Check if user is already attending
      const existingAttendee = await this.attendeeRepository.findByClassAndUser(classe_id, user_id);
      if (existingAttendee) {
        return { message: 'You are already attending this class' };
      }

      // Check class availability
      const classInfo = await this.classRepository.findById(classe_id);
      if (!classInfo || classInfo.nombre_de_places_disponibles <= 0) {
        return { message: 'Class is full' };
      }

      // Get user profile
      const profile = await this.attendeeRepository.getUserProfile(user_id);
      if (!profile) {
        return { message: 'User profile not found' };
      }

      // Determine which product to use
      const product = await this.determineProductType(user_id, classe_id);

      // Create attendee with determined product
      await this.attendeeRepository.create(
        classe_id,
        user_id,
        product
      )

      // Update credits based on product type
      if (product === 'abonnement') {
        const subscription = await this.attendeeRepository.getUserSubscription(profile.id);
        if (subscription) {
          await this.attendeeRepository.updateUsedCredits(subscription.id);
        }
      } else {
        const carte = await this.attendeeRepository.getUserCarte(profile.id);
        if (!carte) {
          throw new Error('No available credits card found');
        }
        await this.attendeeRepository.updateCarteCredits(carte.id);
      }

      // Update class slots
      await this.classRepository.updateAvailableSlots(classe_id);

      return { message: `Successfully added to class using ${product}` };
    } catch (error) {
      console.error('AddPresenceUseCase error:', error);
      throw new Error('Failed to add presence');
    }
  }
}
