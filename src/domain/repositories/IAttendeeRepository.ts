import { Attendee } from '../entities/Attendee';

export interface IAttendeeRepository {
  fetchFiltered(query: string, page: number): Promise<Attendee[]>;
  fetchFilteredAttendees(query: string, limit: number, offset: number): Promise<any[]>;
  getFilteredAttendeesCount(query: string): Promise<number>;
  findByClassAndUser(classe_id: number, user_id: string): Promise<Attendee | null>;
  create(
    classe_id: number,
    user_id: string,
    product: string
  ): Promise<void>;
  getUserProfile(user_id: string): Promise<{ id: number } | null>;
  updateUsedCredits(subscription_id: number): Promise<void>;
  updateCarteCredits(carte_id: number): Promise<void>;
  delete(id: number): Promise<void>;
  getUserSubscription(profile_id: number): Promise<{ 
    id: number, 
    default_classe_1_nom_de_la_classe: string, 
    default_classe_2_nom_de_la_classe: string 
  } | null>;
  getClassInfo(classe_id: number): Promise<{ id: number, nom_de_la_classe: string } | null>;
  getUserCarte(profile_id: number): Promise<{ id: number } | null>;
  getClassDayOfWeek(classe_id: number): Promise<{ nom_de_la_classe: string } | null>;
  getTotalAttendees(query: string): Promise<number>;
}
