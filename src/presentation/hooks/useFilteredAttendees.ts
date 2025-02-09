// src/presentation/hooks/useFilteredAttendees.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Attendee } from '@/src/domain/entities/Attendee';
import { fetchFilteredAttendees } from '@/src/applications/actions/presences/fetchAttendees';
import { useSearchParams } from 'next/navigation';

interface UseFilteredAttendeesResult {
  attendees: Attendee[];
  loading: boolean;
  error: string | null;
  fetchAttendees: (query: string, page: number) => Promise<void>;
}

export function useFilteredAttendees(initialAttendees: Attendee[] = []): UseFilteredAttendeesResult {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const fetchAttendeesData = useCallback(async (query: string, page: number) => {
    try {
      setLoading(true);
      const result = await fetchFilteredAttendees(query, page);
      setAttendees(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch attendees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const query = searchParams?.get('query') || '';
    const page = Number(searchParams?.get('page')) || 1;
    
    const timeoutId = setTimeout(() => {
      fetchAttendeesData(query, page);
    }, query ? 300 : 0); // Add debounce only for search queries

    return () => clearTimeout(timeoutId);
  }, [searchParams, fetchAttendeesData]);

  return {
    attendees,
    loading,
    error,
    fetchAttendees: fetchAttendeesData
  };
}