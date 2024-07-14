import { DeleteAttendee } from '@/app/ui/attendees/buttons';
import { formatDateToLocalFrance} from '@/app/lib/utils';
import { fetchFilteredAttendees } from '@/app/lib/data';

export default async function AttendeesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const attendees = await fetchFilteredAttendees(query, currentPage);

  return (
    <div className="mt-6 flow-root">
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
                      <p><b>{attendeeItem.classe_id}</b></p>
                    </div>
                    <div className="mb-2">
                      <p><i>{attendeeItem.user_id}</i></p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <DeleteAttendee id={attendeeItem.id} />
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
                <th scope="col" className="px-3 py-5 font-medium">
                  User
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
                      <p>{attendeeItem.classe_id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {attendeeItem.user_id}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <DeleteAttendee id={attendeeItem.id} />
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