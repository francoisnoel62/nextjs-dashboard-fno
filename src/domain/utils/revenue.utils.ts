import { Revenue } from '../entities/Revenue';

export function generateYAxis(revenue: Revenue[]) {
    const yAxisLabels = [];
    const dataPoints = revenue.map((month) => month.revenue);
    const maxRevenue = Math.max(...dataPoints);
    const minRevenue = Math.min(...dataPoints);
    const step = (maxRevenue - minRevenue) / 4;

    for (let i = 0; i <= 4; i++) {
        yAxisLabels.push(Math.round(minRevenue + step * i));
    }

    return yAxisLabels;
}