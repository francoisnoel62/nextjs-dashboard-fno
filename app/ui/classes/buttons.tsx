"use client";

import { PlusIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import { addPresence } from '../../lib/actions';


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

/* export function DeleteClass({ id }: { id: number }) {
  const deleteClassWithId = deleteClass.bind(null, id);
  return (
    <form action={deleteClassWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <ArrowRightOnRectangleIcon className="w-5" />
      </button>
    </form>
  );
} */



export function AddPresence({ classe_id }: { classe_id: number }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddPresence = async () => {
    setLoading(true);
    try {

      const result = await addPresence(classe_id);

      if (result?.message) {
        setMessage(result.message);
      }

    } catch (error) {
      console.error(error);
      setMessage('An error occurred while adding the presence');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAddPresence}
        className="rounded-md border p-2 hover:bg-gray-100"
        disabled={loading}
      >
        <ArrowLeftOnRectangleIcon className="w-5" />
        {loading ? 'Adding...' : ''}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

