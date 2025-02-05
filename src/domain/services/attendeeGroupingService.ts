import { getWeekGroup } from '@/src/presentation/utils/week-grouping.utils';
import { Attendee } from '../entities/Attendee';

export type GroupedAttendees = Record<'current' | 'next' | 'future', Attendee[]>;

export class AttendeeGroupingService {
  static groupAttendeesByWeek(attendees: Attendee[]): GroupedAttendees {
    const grouped = attendees.reduce((acc: GroupedAttendees, attendee: Attendee) => {
      const group = getWeekGroup(attendee.date_et_heure?.toString() ?? '') as 'current' | 'next' | 'future';
      acc[group] = acc[group] || [];
      acc[group].push(attendee);
      return acc;
    }, { current: [], next: [], future: [] });

    // Sort attendees in each group by date
    Object.values(grouped).forEach((group) => {
      group.sort((a, b) => new Date(a.date_et_heure?.toString() ?? '').getTime() - new Date(b.date_et_heure?.toString() ?? '').getTime());
    });

    return grouped;
  }
}