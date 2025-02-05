'use server'

import { PostgresClassRepository } from '@/src/infrastructure/repositories/PostgresClassRepository';
import { FetchClassesUseCase } from '@/src/domain/useCases/classes/fetch-classes.use-case';
import { FetchFilteredClassesUseCase } from '@/src/domain/useCases/classes/fetch-filtered-classes.use-case';
import { FetchClassesPagesUseCase } from '@/src/domain/useCases/classes/fetch-classes-pages.use-case';
import { FetchClassTypesUseCase } from '@/src/domain/useCases/classes/fetch-class-types.use-case';

const classRepository = new PostgresClassRepository();

export async function fetchClasses() {
    const useCase = new FetchClassesUseCase(classRepository);
    return useCase.execute();
}

export async function fetchFilteredClasses(query: string, currentPage: number) {
    const useCase = new FetchFilteredClassesUseCase(classRepository);
    return useCase.execute(query, currentPage);
}

export async function fetchClassesPages(query: string) {
    const useCase = new FetchClassesPagesUseCase(classRepository);
    return useCase.execute(query);
}

export async function fetchTypes() {
    const useCase = new FetchClassTypesUseCase(classRepository);
    return useCase.execute();
}