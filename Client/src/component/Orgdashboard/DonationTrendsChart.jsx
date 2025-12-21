import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DonationTrendsChart = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-48 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    // Monthly data matching the reference design
    const chartData = data || [
        { month: 'Jan', donations: 0 },
        { month: 'Feb', donations: 0 },
        { month: 'Mar', donations: 0 },
        { month: 'Apr', donations: 0 },
        { month: 'May', donations: 0 },
        { month: 'Jun', donations: 0 },
        { month: 'Jul', donations: 0 },
        { month: 'Aug', donations: 0 },
        { month: 'Sep', donations: 0 },
        { month: 'Oct', donations: 0 },
        { month: 'Nov', donations: 0.1 },
        { month: 'Dec', donations: 2 }
    ];

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Monthly Donations</h3>
                    <p className="text-xs text-gray-400 mt-1">Trend per month</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="0" stroke="#f5f5f5" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 2.5]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '12px',
                            padding: '8px 12px'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="donations"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#ef4444' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DonationTrendsChart;
