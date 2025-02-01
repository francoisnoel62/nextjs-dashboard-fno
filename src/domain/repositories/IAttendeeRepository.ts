import { Attendee } from '../entities/Attendee';

export interface IAttendeeRepository {
  findByClassAndUser(classe_id: number, user_id: string): Promise<Attendee | null>;
  create(attendee: Attendee): Promise<Attendee>;
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
  getClassDayOfWeek(classe_id: number): Promise<{ day_of_week: string } | null>;
}
