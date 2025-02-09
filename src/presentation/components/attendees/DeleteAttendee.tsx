'use client';

import { deleteAttendee } from '../../../applications/actions/presences/deleteAttendee';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export function DeleteAttendee({ 
  id, 
  containerId,
  onDeleted
}: { 
  id: number; 
  containerId: string;
  onDeleted: () => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this attendee?')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const result = await deleteAttendee(id);
      
      if (!result.success) {
        alert(result.message || 'Failed to delete attendee');
        return;
      }

      // Call the callback to refresh the data
      await onDeleted();
      
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
      aria-label="Delete attendee"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}
