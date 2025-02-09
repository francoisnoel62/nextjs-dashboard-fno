import { fetchAttendeesPages, fetchFilteredAttendees } from '@/src/applications/actions/presences/fetchAttendees';
import { auth } from '@/auth';
import AttendeesPage from '@/src/presentation/components/attendees/AttendeesPage';
import { useGroupedAttendees } from '@/src/presentation/hooks/useGroupedAttendees';

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

    // Fetch the data required for the UI
    const totalPages = await fetchAttendeesPages(query);
    const attendees = await fetchFilteredAttendees(query, currentPage);
    const session = await auth();

    // Ensure we only pass a user object with a valid email
    const user = session?.user?.email ? { email: session.user.email } : null;
    
    // Check if user is admin on the server side
    const isAdmin = user?.email === process.env.DZ_EMAIL;

    // Pass the data as props to the pure UI component
    return (
        <AttendeesPage
            totalPages={totalPages}
            user={user}
            query={query}
            currentPage={currentPage}
            initialAttendees={attendees}
            isAdmin={isAdmin}
        />
    );
}