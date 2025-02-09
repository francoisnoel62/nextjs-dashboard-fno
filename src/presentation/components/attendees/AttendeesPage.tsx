"use client";

import { lusitana } from '@/src/presentation/components/shared/fonts';
import { AttendeesTableSkeleton } from '@/src/presentation/components/shared/skeletons';
import Pagination from './pagination';
import Search from '../shared/search';
import Table from './table';
import PrintAttendees from './print-attendees';
import { Suspense, useCallback, useState } from 'react';
import { Attendee } from '@/src/domain/entities/Attendee';
import { useFilteredAttendees } from '../../hooks/useFilteredAttendees';
import { useGroupedAttendees } from '../../hooks/useGroupedAttendees';

interface AttendeesPageProps {
  totalPages: number;
  query: string;
  currentPage: number;
  user: { email: string } | null;
  initialAttendees: Attendee[];
}

export default function AttendeesPage({
  totalPages,
  query,
  currentPage,
  user,
  initialAttendees,
}: AttendeesPageProps) {
  const [localAttendees, setLocalAttendees] = useState(initialAttendees);
  const { attendees, loading, error, fetchAttendees } = useFilteredAttendees(localAttendees);
  const groupedAttendees = useGroupedAttendees(attendees);

  const handleOptimisticDelete = useCallback((deletedId: number) => {
    // Update local state immediately
    setLocalAttendees(current => current.filter(attendee => attendee.id !== deletedId));
  }, []);

  const handleAttendeeDeleted = useCallback(async () => {
    const query = new URLSearchParams(window.location.search).get('query') || '';
    const page = Number(new URLSearchParams(window.location.search).get('page')) || 1;
    await fetchAttendees(query, page);
  }, [fetchAttendees]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Attendees</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search attendees..." />
        {user?.email === process.env.DZ_EMAIL && <PrintAttendees />}
      </div>
      <Suspense key={query + currentPage} fallback={<AttendeesTableSkeleton />}>
        <Table 
          groupedAttendees={groupedAttendees} 
          loading={loading} 
          error={error} 
          onAttendeeDeleted={handleAttendeeDeleted}
          onOptimisticDelete={handleOptimisticDelete}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
