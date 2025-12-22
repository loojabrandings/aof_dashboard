import { useMemo } from 'react'
import {
    BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts'
import { calculateOrderMetrics, formatCurrency } from '../../utils/reportUtils'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

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
                    <div style={{ height: '260px', width: '100%' }}>
                        <ResponsiveContainer>
                            <AreaChart data={monthlyVolume} margin={{ left: -20, right: 10 }}>
                                <defs>
                                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="date" stroke="#e5e7eb" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#e5e7eb" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: '13px', color: '#f3f4f6' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVolume)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Districts (Geographic) */}
                <div className="card" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top 10 Districts</h3>
                    <div style={{ height: '260px', width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart data={topDistrictsChart} layout="vertical" margin={{ left: -10, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis type="number" stroke="#e5e7eb" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" width={90} stroke="#e5e7eb" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: '13px', color: '#f3f4f6' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={18} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Status Distribution */}
            <div className="card" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Status Distribution</h3>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%" cy="50%"
                                innerRadius={60} outerRadius={100}
                                paddingAngle={3} dataKey="value" stroke="none"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: '13px', color: '#f3f4f6' }}
                                itemStyle={{ color: '#e5e7eb' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', color: '#e5e7eb' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default OrdersReports
