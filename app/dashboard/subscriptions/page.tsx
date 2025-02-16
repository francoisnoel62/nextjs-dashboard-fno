import { Card } from '@/src/presentation/components/dashboard/cards';
import { lusitana } from '@/src/presentation/components/shared/fonts';
import { formatDateToLocalFrance } from '@/src/presentation/utils/formatting/date.utils';
import { fetchCardData } from '@/src/domain/useCases/subscriptions/fetch-card-data.use-case';

export default async function SubscriptionsPage() {
    const {
        nombre_classes_par_semaine_value,
        jour_abonnement_value,
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
                <Card title="Mes jour(s) d'abonnement"
                    value={jour_abonnement_value
                        ? jour_abonnement_value
                        : ""}
                    type="sub"
                    text={jour_abonnement_value
                        ? ""
                        : "Pas d'abonnement en cours"} />
                <Card
                    title="Date échéance abonnement"
                    value={date_echeance_abonnement_value
                        ? formatDateToLocalFrance(date_echeance_abonnement_value.toString())
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
