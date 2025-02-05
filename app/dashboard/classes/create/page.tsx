import { fetchTypes } from '@/src/applications/actions/classes/classes';
import Form from '@/src/presentation/components/classes/create-form';

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