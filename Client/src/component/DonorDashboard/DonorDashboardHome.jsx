import React from 'react';
import WelcomeCard from './WelcomeCard';
import QuickActions from './QuickActions';
import NearbyRequests from './NearbyRequests';
import DonationStats from './DonationStats';
import HistoryList from './HistoryList';
import MapWidget from './MapWidget';
import Appointments from './Appointments';
import Analytics from './Analytics';

const DonorDashboardHome = ({ user, fetchProfile }) => {
    return (
        <div className="lg:col-span-2 space-y-6">
            <WelcomeCard user={user} onRefresh={fetchProfile} />
            <QuickActions />
            <Appointments />
            <div className='grid grid-cols-2 gap-3'>
                <NearbyRequests />
                {/* Map temporarily disabled to avoid duplicate Leaflet container crash */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center text-sm text-gray-500">
                    Map view temporarily disabled
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <DonationStats />
                <Analytics />
            </div>
            <HistoryList user={user} />
        </div>
    );
};

export default DonorDashboardHome;
