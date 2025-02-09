'use client';

import { deleteAttendee } from '../../../applications/actions/presences/deleteAttendee';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export function DeleteAttendee({ 
  id, 
  containerId,
  onDeleted,
  onOptimisticDelete
}: { 
  id: number; 
  containerId: string;
  onDeleted: () => Promise<void>;
  onOptimisticDelete: (id: number) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this attendee?')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      // Trigger optimistic update immediately
      onOptimisticDelete(id);
      
      const result = await deleteAttendee(id);
      
      if (!result.success) {
        alert(result.message || 'Failed to delete attendee');
        // Revert optimistic update on failure
        await onDeleted();
        return;
      }
      
      // Call onDeleted to ensure UI is in sync with server state
      await onDeleted();
      
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting');
      // Revert optimistic update on error
      await onDeleted();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      className={`rounded-md ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'} p-2 transition-colors`}
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Delete attendee"
    >
      <TrashIcon 
        className={`h-5 w-5 ${isDeleting ? 'animate-pulse text-red-300' : 'text-red-500'}`} 
      />
    </button>
  );
}
