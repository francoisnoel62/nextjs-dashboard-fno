import Pagination from '@/app/ui/classes/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/classes/table';
import {lusitana} from '@/app/ui/fonts';
import {ClassesTableSkeleton} from '@/app/ui/skeletons';
import {Suspense} from 'react';
import { fetchClassesPages } from '@/lib/data';
import { CreateClass } from '@/src/presentation/components/classes/CreateClass';
import { auth } from '@/auth';

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

    const totalPages = await fetchClassesPages(query);
    const session = await auth();
    const user = session?.user;

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Classes</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search classes..."/>
                {user && user.email === process.env.DZ_EMAIL && <CreateClass />}
            </div>
            <Suspense key={query + currentPage} fallback={<ClassesTableSkeleton/>}>
                <Table query={query} currentPage={currentPage}/>
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}