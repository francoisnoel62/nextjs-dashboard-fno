import { Class } from '../entities/Class';

export interface IClassRepository {
  findById(id: number): Promise<Class | null>;
  updateAvailableSlots(id: number): Promise<void>;
}
