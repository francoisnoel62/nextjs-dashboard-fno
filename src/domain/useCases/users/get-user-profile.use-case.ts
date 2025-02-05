import { IUserRepository } from '../../repositories/IUserRepository';
import { User } from '../../entities/User';

export class GetUserProfileUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(email: string): Promise<User | null> {
        try {
            return await this.userRepository.findByEmail(email);
        } catch (error) {
            console.error('Use Case Error:', error);
            throw new Error('Failed to fetch user profile.');
        }
    }
}