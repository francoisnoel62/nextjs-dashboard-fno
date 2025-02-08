// app/dashboard/page.tsx (Server Component)
import ClassesPage from '@/src/presentation/components/classes/ClassesPage';
import { auth } from '@/auth';
import { fetchClassesPages, fetchFilteredClasses } from '@/src/applications/actions/classes/classes';

export default async function Page(
  props: {
    searchParams?: Promise<{ query?: string; page?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  // Fetch the data required for the UI
  const totalPages = await fetchClassesPages(query);
  const classes = await fetchFilteredClasses(query, currentPage);
  const session = await auth();

  // Ensure we only pass a user object with a valid email
  const user = session?.user?.email ? { email: session.user.email } : null;

  // Pass the data as props to the pure UI component
  return (
    <ClassesPage
      totalPages={totalPages}
      user={user}
      query={query}
      currentPage={currentPage}
      classes={classes}
    />
  );
}
