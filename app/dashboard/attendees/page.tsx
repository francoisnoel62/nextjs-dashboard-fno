import Pagination from '@/app/ui/attendees/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/attendees/table';
import {lusitana} from '@/app/ui/fonts';
import {AttendeesTableSkeleton} from '@/app/ui/skeletons';
import {Suspense} from 'react';
import { fetchAttendeesPages } from '@/app/lib/data';
import { auth } from '@/auth';
import PrintAttendees from '@/app/dashboard/attendees/print-attendees';

export default async function Page(
    props: {
        searchParams?: Promise<{
            query?: string;
            page?: string;
        }>;
    }
) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await fetchAttendeesPages(query);
    const session = await auth();
    const user = session?.user;

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Attendees</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search attendees..."/>
                {user && user.email === process.env.DZ_EMAIL && <PrintAttendees />}
            </div>
            <Suspense key={query + currentPage} fallback={<AttendeesTableSkeleton/>}>
                <Table query={query} currentPage={currentPage}/>
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}