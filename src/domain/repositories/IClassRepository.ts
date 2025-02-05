import { Class } from '../entities/Class';
import { ClassType } from '../entities/ClassType';

export interface IClassRepository {
    findById(id: number): Promise<Class | null>;
    findAll(): Promise<Class[]>;
    findFiltered(query: string, currentPage: number): Promise<Class[]>;
    getPageCount(query: string): Promise<number>;
    updateAvailableSlots(id: number): Promise<void>;
    getTypes(): Promise<ClassType[]>;
}