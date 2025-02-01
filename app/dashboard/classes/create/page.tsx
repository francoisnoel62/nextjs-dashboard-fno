import Form from '@/app/ui/classes/create-form';
import { fetchClasses, fetchTypes } from '@/lib/data';

export default async function Page() {
  const types = await fetchTypes();

  return (
    <main>
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: 'Classes', href: '/dashboard/classes' },
          {
            label: 'Create Classe',
            href: '/dashboard/classes/create',
            active: true,
          },
        ]}
      /> */}
      <Form types={types} />
    </main>
  );
}