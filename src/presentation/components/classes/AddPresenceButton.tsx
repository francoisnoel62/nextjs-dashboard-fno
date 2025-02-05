'use client';

import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { usePresence } from '../../hooks/usePresence';
import { Toast } from '@/src/presentation/components/shared/notifications';
import { createPortal } from 'react-dom';
import { useState } from 'react';

interface AddPresenceButtonProps {
  classe_id: number;
  containerId?: string;
}

export function AddPresenceButton({ classe_id, containerId = '' }: AddPresenceButtonProps) {
  const { loading, message, showToast, hideToast, handleAddPresence } = usePresence();

  return (
    <>
      <button
        onClick={() => handleAddPresence(classe_id)}
        className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
          loading ? 'bg-blue-400' : 'bg-blue-600'
        } text-white`}
        disabled={loading}
      >
        <span className="hidden md:block">
          {loading ? 'Adding...' : ''}
        </span>
        <ArrowRightOnRectangleIcon className="h-5 md:ml-4" />
      </button>

      {showToast &&
        containerId &&
        createPortal(
          <Toast message={message} onClose={hideToast} />,
          document.getElementById(containerId) || document.body
        )}
    </>
  );
}
