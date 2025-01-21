"use client";

import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteAttendee } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Toast } from '../notifications';

export function CreateAttendee() {
  return (
    <Link
      href="/dashboard/attendees/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Attendee</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function DeleteAttendee({ id, containerId = '' }: { id: string, containerId?: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteAttendee(id);

      if (result?.message) {
        setMessage(result.message);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error deleting attendee:', error);
      setMessage('An error occurred while deleting the attendee');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1000);
    } finally {
      setLoading(false);
    }
  };

  const containerElement = containerId && typeof window !== 'undefined' ? document.getElementById(containerId) : null;

  return (
    <div className="relative">
      <button
        onClick={handleDelete}
        className="rounded-md border p-2 hover:bg-gray-100"
        disabled={loading}
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
      {showToast &&
        containerElement &&
        createPortal(
          <Toast
            message={message}
            onClose={() => setShowToast(false)}
          />,
          containerElement
        )}
    </div>
  );
}