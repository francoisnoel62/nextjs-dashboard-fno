// src/presentation/hooks/useFilteredAttendees.ts
'use client';

import { useState } from 'react';
import { PostgresAttendeeRepository } from '@/src/infrastructure/repositories/PostgresAttendeeRepository';
import { FetchFilteredAttendeesUseCase } from '@/src/domain/useCases/presences/FetchFilteredAttendeesUseCase';
import { Attendee } from '@/src/domain/entities/Attendee';

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

  const fetchAttendees = async (query: string, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const repository = new PostgresAttendeeRepository();
      const useCase = new FetchFilteredAttendeesUseCase(repository);
      const result = await useCase.execute(query, page);
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
    fetchAttendees
  };
}