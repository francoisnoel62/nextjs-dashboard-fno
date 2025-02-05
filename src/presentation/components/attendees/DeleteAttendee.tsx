'use client';

import { deleteAttendee } from '../../../applications/actions/presences/deleteAttendee';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteAttendee({ 
  id, 
  containerId,
  onDeleted
}: { 
  id: number; 
  containerId: string;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this attendee?')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      // Appeler onDeleted immédiatement pour une UX optimiste
      onDeleted?.();
      
      const result = await deleteAttendee(id);
      
      if (!result.success) {
        // En cas d'échec, annuler l'optimisation
        router.refresh();
        alert(result.message || 'Failed to delete attendee');
        return;
      }

      // Pas besoin de rafraîchir car l'action serveur appelle déjà revalidatePath
      console.log('Attendee successfully deleted');
    } catch (error) {
      console.error('Error:', error);
      // En cas d'erreur, annuler l'optimisation
      router.refresh();
      alert('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-md border p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isDeleting}
    >
      {isDeleting ? (
        <div className="w-5 h-5 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin" />
      ) : (
        <TrashIcon className="w-5" />
      )}
    </button>
  );
}
