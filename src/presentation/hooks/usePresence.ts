'use client';

import { useState } from 'react';
import { addPresence } from '@/app/actions/presence';

interface UsePresenceResult {
  loading: boolean;
  message: string;
  showToast: boolean;
  handleAddPresence: (classe_id: number) => Promise<void>;
  hideToast: () => void;
}

export function usePresence(): UsePresenceResult {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const hideToast = () => setShowToast(false);

  const handleAddPresence = async (classe_id: number) => {
    setLoading(true);
    try {
      const result = await addPresence(classe_id);
      if (result?.message) {
        setMessage(result.message);
        setShowToast(true);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while adding the presence');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    message,
    showToast,
    hideToast,
    handleAddPresence
  };
}
