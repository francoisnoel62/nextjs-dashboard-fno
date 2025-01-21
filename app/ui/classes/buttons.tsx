"use client";

import { PlusIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import { addPresence } from '../../lib/actions';
import { Toast } from '../notifications';
import { createPortal } from 'react-dom';


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



export function AddPresence({ classe_id, containerId = '', }: { classe_id: number, containerId?: string; }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);


  const handleAddPresence = async () => {
    setLoading(true);
    try {
      const result = await addPresence(classe_id);

      if (result?.message) {
        setMessage(result.message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Auto-hide after 3 seconds
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while adding the presence');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Auto-hide after 3 seconds
    } finally {
      setLoading(false);
    }
  };

  const containerElement = containerId && typeof window !== 'undefined' ? document.getElementById(containerId) : null;

  return (
    <div className="relative">
      <button
        onClick={handleAddPresence}
        className="flex items-center rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        disabled={loading}
      >
        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
      </button>
      {showToast &&
        containerElement &&
        createPortal(
          <Toast
            message={message}
            onClose={() => setShowToast(false)}
            variant='success'
          />,
          containerElement
        )}
    </div>
  );
}