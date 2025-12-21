import React from 'react';
import { TrendingUp, TrendingDown, Activity, CheckCircle, Calendar, BarChart3 } from 'lucide-react';

const DonationStatsCards = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const cards = [
        {
            title: "Total in Pipeline",
            value: stats.totalInPipeline || 0,
            icon: Activity,
            color: "blue",
            gradient: "from-blue-500 to-blue-600",
            bgLight: "bg-blue-50",
            textColor: "text-blue-600",
            subtitle: `${stats.today || 0} added today`,
            breakdown: stats.byStage
        },
        {
            title: "Today's Donations",
            value: stats.today || 0,
            icon: Calendar,
            color: "purple",
            gradient: "from-purple-500 to-purple-600",
            bgLight: "bg-purple-50",
            textColor: "text-purple-600",
            subtitle: `${stats.completedToday || 0} completed`,
        },
        {
            title: "Success Rate",
            value: `${stats.successRate || 0}%`,
            icon: CheckCircle,
            color: stats.successRate >= 90 ? "green" : stats.successRate >= 75 ? "yellow" : "red",
            gradient: stats.successRate >= 90 ? "from-green-500 to-green-600" : stats.successRate >= 75 ? "from-yellow-500 to-yellow-600" : "from-red-500 to-red-600",
            bgLight: stats.successRate >= 90 ? "bg-green-50" : stats.successRate >= 75 ? "bg-yellow-50" : "bg-red-50",
            textColor: stats.successRate >= 90 ? "text-green-600" : stats.successRate >= 75 ? "text-yellow-600" : "text-red-600",
            subtitle: stats.failedTests > 0 ? `${stats.failedTests} failed tests` : "All tests passed",
            trend: stats.successRate >= 90 ? "up" : stats.successRate >= 75 ? "stable" : "down"
        },
        {
            title: "This Month",
            value: stats.thisMonth || 0,
            icon: BarChart3,
            color: "indigo",
            gradient: "from-indigo-500 to-indigo-600",
            bgLight: "bg-indigo-50",
            textColor: "text-indigo-600",
            subtitle: `${stats.thisWeek || 0} this week`,
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                            <card.icon className="w-6 h-6 text-white" />
                        </div>
                        {card.trend && (
                            <div className={`flex items-center gap-1 ${card.textColor}`}>
                                {card.trend === "up" ? <TrendingUp size={16} /> : card.trend === "down" ? <TrendingDown size={16} /> : null}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                        <p className="text-xs text-gray-500">{card.subtitle}</p>
                    </div>

                    {/* Stage Breakdown for Total Pipeline card */}
                    {card.breakdown && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                            {Object.entries(card.breakdown).map(([stage, count]) => {
                                const stageNames = {
                                    'new-donors': 'New',
                                    'screening': 'Screening',
                                    'in-progress': 'Collection',
                                    'completed': 'Testing',
                                    'ready-storage': 'Ready'
                                };
                                const percentage = stats.totalInPipeline > 0 ? Math.round((count / stats.totalInPipeline) * 100) : 0;
                                return (
                                    <div key={stage} className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">{stageNames[stage]}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-semibold text-gray-700 w-6 text-right">{count}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DonationStatsCards;
