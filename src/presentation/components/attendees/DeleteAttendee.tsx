'use client';

import { deleteAttendee } from '../../../../app/actions/attendees';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export function DeleteAttendee({ id, containerId }: { id: string; containerId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this attendee?')) {
      try {
        const result = await deleteAttendee(id);
        
        if (!result.success) {
          console.error('Failed to delete:', result.message);
          return;
        }
        
        router.refresh();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <TrashIcon className="w-5" />
    </button>
  );
}
