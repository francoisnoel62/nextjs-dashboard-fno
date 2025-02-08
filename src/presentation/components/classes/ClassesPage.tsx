// components/ClassesPage.tsx
import Pagination from '@/src/presentation/components/classes/pagination';
import Search from '@/src/presentation/components/shared/search';
import Table from '@/src/presentation/components/classes/table';
import { lusitana } from '@/src/presentation/components/shared/fonts';
import { ClassesTableSkeleton } from '@/src/presentation/components/shared/skeletons';
import { Suspense } from 'react';
import { CreateClass } from '@/src/presentation/components/classes/CreateClass';
import { Class } from '@/src/domain/entities/Class';

interface ClassesPageProps {
  totalPages: number;
  user: { email: string } | null;
  query: string;
  currentPage: number;
  classes: Class[];
}

export default function ClassesPage({
  totalPages,
  user,
  query,
  currentPage,
  classes,
}: ClassesPageProps) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Classes</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search classes..." />
        {user && user.email === process.env.DZ_EMAIL && <CreateClass />}
      </div>
      <Suspense key={query + currentPage} fallback={<ClassesTableSkeleton />}>
        <Table classes={classes} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
