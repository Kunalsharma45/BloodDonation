import React from 'react';
import { Navigation, History, Search } from 'lucide-react';

const QuickActions = () => {
    const actions = [
        { name: 'Update Location', icon: Navigation, desc: 'Keep your location current', color: 'bg-blue-50 text-blue-600' },
        { name: 'Donation History', icon: History, desc: 'Check your past records', color: 'bg-purple-50 text-purple-600' },
        { name: 'Find Blood Banks', icon: Search, desc: 'Locate nearest centers', color: 'bg-orange-50 text-orange-600' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {actions.map((action) => {
                const Icon = action.icon;
                return (
                    <button
                        key={action.name}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 text-left group"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 text-sm">{action.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default QuickActions;
