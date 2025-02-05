// src/presentation/hooks/useFilteredAttendees.ts
'use client';

import { useState } from 'react';
import { Attendee } from '@/src/domain/entities/Attendee';
import { fetchFilteredAttendees } from '@/src/applications/actions/presences/fetchAttendees';

interface UseFilteredAttendeesResult {
  attendees: Attendee[];
  loading: boolean;
  error: string | null;
  fetchAttendees: (query: string, page: number) => Promise<void>;
}

export function useFilteredAttendees(): UseFilteredAttendeesResult {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendeesData = async (query: string, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFilteredAttendees(query, page);
      setAttendees(result);
    } catch (err) {
      setError('Failed to fetch attendees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    attendees,
    loading,
    error,
    fetchAttendees: fetchAttendeesData
  };
}