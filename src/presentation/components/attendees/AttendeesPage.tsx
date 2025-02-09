"use client";

import { lusitana } from '@/src/presentation/components/shared/fonts';
import Pagination from './pagination';
import Search from '../shared/search';
import Table from './table';
import PrintAttendees from './print-attendees';
import { Suspense, useCallback } from 'react';
import { Attendee } from '@/src/domain/entities/Attendee';
import { useFilteredAttendees } from '../../hooks/useFilteredAttendees';
import { useGroupedAttendees } from '../../hooks/useGroupedAttendees';
import { useSearchParams } from 'next/navigation';
import AttendeesTableSkeleton from '../skeletons/AttendeeTableSkeleton';

interface AttendeesPageProps {
  totalPages: number;
  query: string;
  currentPage: number;
  user: { email: string } | null;
  initialAttendees: Attendee[];
  isAdmin?: boolean;
}

export default function AttendeesPage({
  totalPages,
  query,
  currentPage,
  user,
  initialAttendees,
  isAdmin = false,
}: AttendeesPageProps) {
  const searchParams = useSearchParams();
  const { attendees, loading, error, fetchAttendees } = useFilteredAttendees(initialAttendees);
  const groupedAttendees = useGroupedAttendees(attendees);

  const handleOptimisticDelete = useCallback((deletedId: number) => {
    fetchAttendees(
      searchParams.get('query') || '',
      Number(searchParams.get('page')) || 1
    );
  }, [fetchAttendees, searchParams]);

  const handleAttendeeDeleted = useCallback(async () => {
    const currentQuery = searchParams.get('query') || '';
    const currentPage = Number(searchParams.get('page')) || 1;
    await fetchAttendees(currentQuery, currentPage);
  }, [fetchAttendees, searchParams]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Attendees</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search attendees..." />
        {isAdmin && <PrintAttendees />}
      </div>
      <Suspense key={query + currentPage} fallback={<AttendeesTableSkeleton />}>
        <Table 
          groupedAttendees={groupedAttendees} 
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
