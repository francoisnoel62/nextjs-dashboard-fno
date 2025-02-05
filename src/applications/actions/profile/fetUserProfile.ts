'use server'

import { PostgresUserRepository } from '@/src/infrastructure/repositories/PostgresUserRepository';
import { auth } from '@/auth';
import { FetchUserProfileUseCase } from '@/src/domain/useCases/profile/FetchUserProfileUseCase';

const userRepository = new PostgresUserRepository();

export async function fetchProfileByUserId(userId: string) {
    const useCase = new FetchUserProfileUseCase(userRepository);
    return useCase.execute(userId);
}