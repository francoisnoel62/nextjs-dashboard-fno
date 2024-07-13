import Image from 'next/image';
import { UpdateClass, DeleteClass } from '@/app/ui/classes/buttons';
import {formatDateToLocal, formatDateToLocalFrance} from '@/app/lib/utils';
import { fetchFilteredClasses } from '@/app/lib/data';

export default async function ClassesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const classes = await fetchFilteredClasses(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {classes?.map((classItem) => (
              <div
                key={classItem.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2">
                      <p><b>{classItem.nom_de_la_classe}</b></p>
                      <p>{formatDateToLocalFrance(classItem.date_et_heure)}</p>
                    </div>
                    <div className="mb-2">
                      <p><i>{classItem.nombre_de_places_disponibles} places disponibles</i></p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateClass id={classItem.id} />
                    <DeleteClass id={classItem.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">Type</th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Places
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <div className="flex justify-end gap-3"><p>Book/Cancel</p></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {classes?.map((classItem) => (
                <tr
                  key={classItem.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{classItem.nom_de_la_classe}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {classItem.type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocalFrance(classItem.date_et_heure)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {classItem.nombre_de_places_disponibles}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateClass id={classItem.id} />
                      <DeleteClass id={classItem.id} />
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

