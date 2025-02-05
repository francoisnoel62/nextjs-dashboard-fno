import { IAttendeeRepository } from '../../repositories/IAttendeeRepository';

export class DeleteAttendeeUseCase {
  constructor(private attendeeRepository: IAttendeeRepository) {}

  async execute(id: number): Promise<void> {
    await this.attendeeRepository.delete(id);
  }
}
