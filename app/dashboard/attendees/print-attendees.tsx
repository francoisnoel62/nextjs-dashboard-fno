'use client';

import { useTransition } from 'react';
import { generateAttendeesReport } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function PrintAttendees() {
  const [isPending, startTransition] = useTransition();

  const handlePrint = () => {
    startTransition(async () => {
      try {
        const pdfBytes = await generateAttendeesReport();
        
        // Create blob and download
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `attendees-report-${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading PDF:', error);
        alert('Failed to generate report');
      }
    });
  };

  return (
    <Button
      onClick={handlePrint}
      disabled={isPending}
      className="flex items-center gap-2"
    >
      <ArrowDownTrayIcon className="h-4 w-4" />
      {isPending ? 'Generating...' : 'Exporter liste présences'}
    </Button>
  );
}