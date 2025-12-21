import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const BloodGroupChart = ({ data, loading }) => {
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

    // Blood group data matching the reference design
    const chartData = data || [
        { name: 'A+', value: 45, color: '#ff6b9d' },
        { name: 'A-', value: 12, color: '#ff8fb3' },
        { name: 'AB+', value: 8, color: '#4ecdc4' },
        { name: 'AB-', value: 5, color: '#95e1d3' },
        { name: 'B+', value: 18, color: '#5dade2' },
        { name: 'B-', value: 7, color: '#85c1e9' },
        { name: 'O+', value: 35, color: '#f1948a' },
        { name: 'O-', value: 10, color: '#f5b7b1' }
    ];

    const totalUnits = chartData.reduce((sum, item) => sum + item.value, 0);

    // Find low stock blood types (less than 10 units)
    const lowStock = chartData
        .filter(item => item.value < 10)
        .map(item => item.name)
        .join(', ');

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Blood Type Availability</h3>
                    <p className="text-xs text-gray-400 mt-1">Units by group</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-6">
                {/* Pie Chart */}
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    padding: '8px 12px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-2">
                    {chartData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2 text-sm">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="font-medium text-gray-700 w-8">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Low Stock Warning */}
            {lowStock && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        <span className="font-semibold">Low stock:</span> {lowStock}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BloodGroupChart;
