import AttendeesTableSkeleton from '@/src/presentation/components/skeletons/AttendeeTableSkeleton';
import { lusitana } from '@/src/presentation/components/shared/fonts';
import Search from '@/src/presentation/components/shared/search';

export default function Loading() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Attendees</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search attendees..." />
      </div>
      <AttendeesTableSkeleton />
      <div className="mt-5 flex w-full justify-center">
        {/* Pagination placeholder */}
        <div className="h-10 w-full max-w-md rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}
