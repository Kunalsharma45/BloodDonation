import React, { useEffect, useState } from 'react';
import { Droplet, Award, TrendingUp } from 'lucide-react';
import LoadingSkeleton from '../common/LoadingSkeleton';
import donorApi from '../../api/donorApi';

const DonationStats = () => {
    const [stats, setStats] = useState({
        totalDonations: 0,
        livesSaved: 0,
        recent: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await donorApi.getStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
                <LoadingSkeleton width="w-1/3" className="mb-6" />
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <LoadingSkeleton height="h-24" />
                    <LoadingSkeleton height="h-24" />
                </div>
                <LoadingSkeleton width="w-1/4" height="h-3" className="mb-3" />
                <LoadingSkeleton count={3} height="h-12" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Your Impact</h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-red-100">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                        <Droplet size={20} className="fill-current" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{stats.totalDonations}</span>
                    <span className="text-xs text-gray-500">Total Donations</span>
                </div>
                <div className="bg-teal-50 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-teal-100">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mb-2">
                        <Award size={20} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{stats.livesSaved}</span>
                    <span className="text-xs text-gray-500">Lives Saved</span>
                </div>
            </div>

            <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent History</h4>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-2">
                {stats.recent.length > 0 ? (
                    stats.recent.map((item) => (
                        <div key={item.id} className="relative pl-6">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-red-400"></div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.location}</p>
                                    <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                    {item.units} Unit
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 pl-4">No recent donations.</p>
                )}
            </div>

            <button className="w-full mt-2 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors py-2">
                <TrendingUp size={14} />
                View full history
            </button>
        </div>
    );
};

export default DonationStats;
