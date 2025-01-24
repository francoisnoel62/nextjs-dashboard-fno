import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from "@/app/lib/data";
import { Suspense } from 'react';
import { LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';
import { formatDateToLocalFrance } from '@/app/lib/utils';

export default async function SubscriptionsPage() {
    const {
        nombre_classes_par_semaine_value,
        date_echeance_abonnement_value,
        current_credits_value,
        total_anciennes_cartes_value
    } = await fetchCardData();
    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Subscriptions
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card title="Abonnement en cours"
                    value={nombre_classes_par_semaine_value
                        ? nombre_classes_par_semaine_value
                        : ""}
                    type="sub"
                    text={nombre_classes_par_semaine_value
                        ? "classes par semaine"
                        : "Pas d'abonnement en cours"} />
                <Card
                    title="Date échéance abonnement"
                    value={date_echeance_abonnement_value
                        ? formatDateToLocalFrance(date_echeance_abonnement_value.toISOString())
                        : 'Pas de date'}
                    type="sub"
                />
                <Card title="Carte à 10 en cours"
                    value={current_credits_value
                        ? current_credits_value
                        : ""}
                    type="card"
                    text={current_credits_value
                        ? "crédits restants"
                        : "Pas de carte à 10 en cours"} />
                <Card title="Total cartes terminées"
                    value={total_anciennes_cartes_value
                        ? total_anciennes_cartes_value
                        : ""}
                    type="card"
                    text={total_anciennes_cartes_value
                        ? "anciennes cartes"
                        : "Pas de cartes terminées"} />
            </div>
            {/*             <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div> */}
        </main>
    );
}