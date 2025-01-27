import { ClasseTypeField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CalendarDateRangeIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createClass } from '@/app/lib/actions';

export default function Form({ types }: { types: ClasseTypeField[] }) {
  return (
    <form action={createClass}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 max-w-md mx-auto">
        {/* Classe Name */}
        <div className="mb-4">
          <label htmlFor="classe" className="mb-2 block text-sm font-medium">
            Classe name
          </label>
          <div className="relative">
            <input
              id="classe"
              name="classe"
              type="text"
              placeholder="Enter classe name"
              className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Classe date */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Date et heure
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="date"
                name="date"
                type="datetime-local"
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
              />
              <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Type classe */}
        <div className="mb-4">
          <label htmlFor="type" className="mb-2 block text-sm font-medium">
            Choose type
          </label>
          <div className="relative">
            <select
              id="type"
              name="typeId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select a type
              </option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nombre de places disponibles */}
        <div className="mb-4">
          <label htmlFor="seats" className="mb-2 block text-sm font-medium">
            Nombre de places disponibles
          </label>
          <div className="relative">
            <input
              id="seats"
              name="seats"
              type="number"
              placeholder="Enter number of seats"
              className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4 max-w-md mx-auto">
        <Link
          href="/dashboard/classes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create classe</Button>
      </div>
    </form>
  );
}
