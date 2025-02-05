import { PostgresUserRepository } from "@/src/infrastructure/repositories/PostgresUserRepository";

export class FetchUserProfileUseCase {
    constructor(private readonly userRepository: PostgresUserRepository) {}

    async execute(userId: string) {
        return this.userRepository.findById(userId);
    }
}
