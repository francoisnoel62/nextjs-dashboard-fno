import {
  BookmarkSquareIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/src/presentation/components/shared/fonts';

const iconMap = {
  sub: BookmarkSquareIcon,
  card: ClipboardDocumentIcon,
};

export default async function CardWrapper() {
  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course */}

      {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Pending" value={totalPendingInvoices} type="pending" />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      /> */}
    </>
  );
}

export function Card({
  title,
  value,
  type,
  text,
}: {
  title: string;
  value: number | string;
  type: 'sub' | 'card';
  text?: string;
}) {
  const Icon = iconMap[type] || null;

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-sm text-gray-500`}>
        <i>{value} {text}</i>
      </p>
    </div>
  );
}
