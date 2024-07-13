import { PencilIcon, PlusIcon, TrashIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon  } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteClass } from '@/app/lib/actions';

export function CreateClass() {
  return (
    <Link
      href="/dashboard/classes/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Class</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateClass({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/classes/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <ArrowLeftOnRectangleIcon className="w-5" />
    </Link>
  );
}

export function DeleteClass({ id }: { id: number }) {
  const deleteClassWithId = deleteClass.bind(null, id);
  return (
    <form action={deleteClassWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <ArrowRightOnRectangleIcon className="w-5" />
      </button>
    </form>
  );
}