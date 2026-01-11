import { useMemo } from 'react'
import BaseAreaChart from '../Common/Charts/BaseAreaChart'
import BaseBarChart from '../Common/Charts/BaseBarChart'
import BaseDonutChart from '../Common/Charts/BaseDonutChart'
import { calculateOrderMetrics, formatCurrency } from '../../utils/reportUtils'

import { COLORS } from './ChartConfig'

const OrdersReports = ({ orders, isMobile }) => {
    const {
        statusData,
        avgProcessingTime,
        avgOrderValue,
        monthlyVolume,
        districtData,
        topDistrict,
        repeatRate,
        totalOrders
    } = useMemo(() => calculateOrderMetrics(orders), [orders])

    // Take top 10 districts
    const topDistrictsChart = useMemo(() => districtData.slice(0, 10), [districtData])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem' }}>
            <style>{`
                .order-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
                    gap: 1rem;
                }
                .order-charts-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
                    gap: 1.5rem;
                }
                @media (max-width: 768px) {
                    .order-stats-grid { grid-template-columns: 1fr 1fr; }
                    .order-charts-row { grid-template-columns: 1fr; }
                }
            `}</style>

            {/* Summary Cards */}
            <div className="order-stats-grid">
                <div className="card" style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>Total Orders</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalOrders}</p>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>Avg Order Value</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(Number(avgOrderValue))}</p>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>Top District</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={topDistrict}>{topDistrict}</p>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>Avg Processing</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{avgProcessingTime} Days</p>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>Repeat Customer Rate</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--warning)' }}>{repeatRate}%</p>
                </div>
            </div>

            {/* Seasonality & Districts */}
            <div className="order-charts-row">
                {/* Seasonality Trend */}
                <div className="card" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Volume Trend</h3>
                    <BaseAreaChart
                        data={monthlyVolume}
                        dataKey="count"
                        color={COLORS[4]}
                        gradientId="colorVolume"
                        tooltipFormatter={(val) => val}
                        height={260}
                    />
                </div>

                {/* Top Districts (Geographic) */}
                <div className="card" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top 10 Districts</h3>
                    <BaseBarChart
                        data={topDistrictsChart}
                        layout="vertical"
                        barKeys={[{ key: 'value', color: COLORS[5] }]}
                        xAxisKey="name"
                        tooltipFormatter={(val) => val}
                        barSize={18}
                        height={260}
                    />
                </div>
            </div>

            {/* Status Distribution */}
            <div className="card" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Status Distribution</h3>
                <BaseDonutChart
                    data={statusData}
                    centerLabel="Total Orders"
                    centerValue={totalOrders}
                    height={300}
                    tooltipFormatter={(val) => val}
                />
            </div>
        </div>
    )
}

export default OrdersReports
