"use client";

import { DeleteAttendee } from '@/src/presentation/components/attendees/DeleteAttendee';
import { formatDateToLocalFrance } from '@/src/presentation/utils/formating/date.utils';
import { getWeekGroupTitle } from '@/src/presentation/utils/week-grouping.utils';
import { Attendee } from '@/src/domain/entities/Attendee';
import { GroupedAttendees } from '@/src/domain/services/attendeeGroupingService';
import { useId } from 'react';

export default function AttendeesTable({
  groupedAttendees,
  loading,
  error,
  onAttendeeDeleted
}: {
  groupedAttendees: GroupedAttendees;
  loading: boolean;
  error: string | null;
  onAttendeeDeleted: () => Promise<void>;
}) {
  const uniqueIdPrefix = useId();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const renderGroup = (attendees: Attendee[], group: 'current' | 'next' | 'future') => {
    if (!attendees?.length) return null;

    return (
      <div key={group} className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{getWeekGroupTitle(group)}</h2>
        {/* Version mobile */}
        <div className="md:hidden">
          {attendees.map((attendeeItem, index) => (
            <div
              key={attendeeItem.id?.toString() ?? `${uniqueIdPrefix}-${group}-${index}`}
              className="bg-white rounded-lg shadow mb-4 p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{attendeeItem.nom_de_la_classe}</p>
                  <p className="text-sm text-gray-600">
                    {attendeeItem.date_et_heure ? formatDateToLocalFrance(attendeeItem.date_et_heure.toString()) : ''}
                  </p>
                </div>
                <DeleteAttendee 
                  id={attendeeItem.id} 
                  containerId={attendeeItem.classe_id.toString()}
                  onDeleted={onAttendeeDeleted}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Version desktop */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendees.map((attendeeItem, index) => (
                <tr key={attendeeItem.id?.toString() ?? `${uniqueIdPrefix}-${group}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {attendeeItem.nom_de_la_classe}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {attendeeItem.date_et_heure ? formatDateToLocalFrance(attendeeItem.date_et_heure.toString()) : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DeleteAttendee 
                      id={attendeeItem.id} 
                      containerId={attendeeItem.classe_id.toString()}
                      onDeleted={onAttendeeDeleted}
                    />
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
    <div className="mt-6">
      {renderGroup(groupedAttendees.current, 'current')}
      {renderGroup(groupedAttendees.next, 'next')}
      {renderGroup(groupedAttendees.future, 'future')}
    </div>
  );
}