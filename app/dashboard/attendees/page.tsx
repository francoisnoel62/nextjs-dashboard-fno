import Pagination from '@/src/presentation/components/attendees/pagination';
import Search from '@/src/presentation/components/shared/search';
import Table from '@/src/presentation/components/attendees/table';
import {lusitana} from '@/src/presentation/components/shared/fonts';
import {AttendeesTableSkeleton} from '@/src/presentation/components/shared/skeletons';
import {Suspense} from 'react';
import { auth } from '@/auth';
import PrintAttendees from '@/src/presentation/components/attendees/print-attendees';
import { fetchAttendeesPages } from '@/src/applications/actions/presences/fetchAttendees';

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