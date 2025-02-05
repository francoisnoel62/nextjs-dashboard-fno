"use client";

import { DeleteAttendee } from '@/src/presentation/components/attendees/DeleteAttendee';
import { formatDateToLocalFrance } from '@/src/presentation/utils/formating/date.utils';
import { getWeekGroupTitle } from '@/src/presentation/utils/week-grouping.utils';
import { Attendee } from '@/src/domain/entities/Attendee';
import { useEffect } from 'react';
import { useFilteredAttendees } from '../../hooks/useFilteredAttendees';
import { useGroupedAttendees } from '../../hooks/useGroupedAttendees';

export default function AttendeesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const { attendees, loading, error, fetchAttendees } = useFilteredAttendees();
  const groupedAttendees = useGroupedAttendees(attendees);

  useEffect(() => {
    fetchAttendees(query, currentPage);
  }, [query, currentPage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const renderGroup = (attendees: Attendee[], group: 'current' | 'next' | 'future') => {
    if (!attendees?.length) return null;

    return (
      <div key={group} className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{getWeekGroupTitle(group)}</h2>
        {/* Version mobile */}
        <div className="md:hidden">
          {attendees.map((attendeeItem) => (
            <div
              key={attendeeItem.id?.toString() ?? 'temp-' + Math.random()}
              className="bg-white rounded-lg shadow mb-4 p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{attendeeItem.classe_id}</p>
                  <p className="text-sm text-gray-600">
                    {formatDateToLocalFrance(attendeeItem.created_at?.toString() ?? '')}
                  </p>
                </div>
                <DeleteAttendee id={attendeeItem.id} containerId={attendeeItem.classe_id.toString()} />
              </div>
            </div>
          ))}
        </div>

        {/* Version desktop */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Classe
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendees.map((attendeeItem) => (
                <tr key={attendeeItem.id?.toString() ?? 'temp-' + Math.random()}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {attendeeItem.classe_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateToLocalFrance(attendeeItem.created_at?.toString() ?? '')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DeleteAttendee id={attendeeItem.id} containerId={attendeeItem.classe_id.toString()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      {Object.entries(groupedAttendees).map(([group, attendees]) =>
        renderGroup(attendees, group as 'current' | 'next' | 'future')
      )}
    </div>
  );
}