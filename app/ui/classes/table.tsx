import { AddPresence } from '@/app/ui/classes/buttons';
import { formatDateToLocalFrance } from '@/app/lib/utils';
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
    <div id="classes-tables" className="relative mt-6 flow-root">
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
                      <p><i>{formatDateToLocalFrance(classItem.date_et_heure)}</i></p>
                    </div>
                    <div className="mb-2 text-gray-500">
                      <p><i>{classItem.nombre_de_places_disponibles} places disponibles</i></p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <AddPresence classe_id={classItem.id} containerId='classes-tables' />
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
                  <div className="flex justify-end gap-3"><p>Book</p></div>
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
                      <p><b>{classItem.nom_de_la_classe}</b></p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded border ${
                      classItem.type === 'adults'
                      ? 'bg-blue-100 text-blue-800 border-blue-400'
                      : classItem.type === 'adults&teens'
                      ? 'bg-green-100 text-green-800 border-green-400'
                      : classItem.type === 'kids'
                      ? 'bg-pink-100 text-pink-800 border-pink-400'
                      : classItem.type === 'teens'
                      ? 'bg-gray-100 text-gray-800 border-gray-400'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-400'
                      }`}>
                      {classItem.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <i>{formatDateToLocalFrance(classItem.date_et_heure)}</i>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-500">
                    {classItem.nombre_de_places_disponibles}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <AddPresence classe_id={classItem.id} containerId='classes-tables' />
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

