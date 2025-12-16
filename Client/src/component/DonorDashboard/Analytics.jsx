import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import client from '../../api/client';

const Analytics = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Ideally backend sends this format, or we process it here.
                // Reusing /stats endpoint or creating new one.
                // Let's assume /stats returns summary, but we need monthly data.
                // For now, let's mock the chart data or fetch history and process it.
                // Processing history locally is easier if dataset is small.
                const res = await client.get('/api/donor/history');
                const appts = res.data.appts || [];

                // Process donations by month
                const months = {};
                appts.forEach(a => {
                    if (a.status === 'COMPLETED') {
                        const date = new Date(a.dateTime);
                        const month = date.toLocaleString('default', { month: 'short' });
                        months[month] = (months[month] || 0) + 1;
                    }
                });

                const chartData = Object.keys(months).map(key => ({
                    name: key,
                    donations: months[key]
                }));

                // Sort by month order if needed, but simple map is OK for "donations by month" view
                setData(chartData);
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="h-64 bg-gray-50 rounded-xl animate-pulse"></div>;

    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex flex-col items-center justify-center text-center">
                <p className="text-gray-500 mb-2">No donation data available for analytics yet.</p>
                <p className="text-xs text-gray-400">Complete your first donation to see charts!</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Donation Trends</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: '#FEF2F2' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="donations" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
