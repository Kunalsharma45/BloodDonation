import React from 'react';
import WelcomeCard from './WelcomeCard';
import QuickActions from './QuickActions';
import NearbyRequests from './NearbyRequests';
import DonationStats from './DonationStats';
import HistoryList from './HistoryList';
import GoogleMapWidget from './GoogleMapWidget';
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
                <GoogleMapWidget />
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
