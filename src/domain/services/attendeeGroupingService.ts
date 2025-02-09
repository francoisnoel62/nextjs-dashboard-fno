import { getWeekGroup } from '@/src/presentation/utils/week-grouping.utils';
import { Attendee } from '../entities/Attendee';

export type GroupedAttendees = Record<'current' | 'next' | 'future', Attendee[]>;

export class AttendeeGroupingService {
  static groupAttendeesByWeek(attendees: Attendee[]): GroupedAttendees {
    // Pre-process dates once to avoid repeated string parsing
    const attendeesWithDates = attendees.map(attendee => ({
      ...attendee,
      parsedDate: new Date(attendee.date_et_heure?.toString() ?? '')
    }));

    // Sort once before grouping
    attendeesWithDates.sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

    const grouped = attendeesWithDates.reduce((acc: GroupedAttendees, attendee) => {
      const group = getWeekGroup(attendee.parsedDate.toString()) as 'current' | 'next' | 'future';
      acc[group] = acc[group] || [];
      acc[group].push(attendee);
      return acc;
    }, { current: [], next: [], future: [] });

    // No need to sort again since we pre-sorted
    return grouped;
  }
}