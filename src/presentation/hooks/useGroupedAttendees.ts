import { useMemo } from 'react';
import { Attendee } from '@/src/domain/entities/Attendee';
import { AttendeeGroupingService, GroupedAttendees } from '@/src/domain/services/attendeeGroupingService';

export function useGroupedAttendees(attendees: Attendee[]): GroupedAttendees {
  return useMemo(() => 
    AttendeeGroupingService.groupAttendeesByWeek(attendees),
    [attendees]
  );
}