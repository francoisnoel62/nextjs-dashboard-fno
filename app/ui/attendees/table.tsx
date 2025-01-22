import { DeleteAttendee } from '@/app/ui/attendees/buttons';
import { fetchFilteredAttendees } from '@/app/lib/data';
import { formatDateToLocalFrance } from "@/app/lib/utils";

export default async function AttendeesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const attendees = await fetchFilteredAttendees(query, currentPage);

  if ('message' in attendees) {
    return <div>{attendees.message}</div>;
  }

  return (
    <div id="attendees-tables" className="relative mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {attendees?.map((attendeeItem) => (
              <div
                key={attendeeItem.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2">
                      <p><b>{attendeeItem.classe_name}</b></p>
                    </div>
                    <div className="mb-2 text-sm text-gray-500">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{attendeeItem.classe_type}</span>
                    </div>
                    <div className="mb-2">
                      <p><i>{formatDateToLocalFrance(attendeeItem.classe_date)}</i></p>
                    </div>
                    <div className="mb-2 text-sm text-gray-500">
                      <p><i>Booked on {formatDateToLocalFrance(attendeeItem.booking_date)}</i></p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <DeleteAttendee id={attendeeItem.id} containerId='attendees-tables' />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Classe
                </th>
                <th scope="col" className="px-3 py-5 font-medium">Type de classe</th>
                <th scope="col" className="px-3 py-5 font-medium">Date de la classe</th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date de réservation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {attendees?.map((attendeeItem) => (
                <tr
                  key={attendeeItem.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p><b>{attendeeItem.classe_name}</b></p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-3">
                      <p><i>{attendeeItem.classe_type}</i></p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p><i>{formatDateToLocalFrance(attendeeItem.classe_date)}</i></p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-500">
                    {formatDateToLocalFrance(attendeeItem.booking_date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <DeleteAttendee id={attendeeItem.id} containerId='attendees-tables' />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}