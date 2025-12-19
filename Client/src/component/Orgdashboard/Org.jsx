import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrgSidebar from './OrgSidebar';
import OrgOverview from './OrgOverview';
import InventoryView from './InventoryView';
import RequestsView from './RequestsView';
import IncomingRequestsTab from './IncomingRequestsTab';
import AppointmentsTab from './AppointmentsTab';
import CampsTab from './CampsTab';
import AnalyticsTab from './AnalyticsTab';
import ProfileTab from './ProfileTab';
import MyRequestsPage from './MyRequestsPage';
import IncomingRequestsPage from './IncomingRequestsPage';
import DonationPipelineTab from './DonationPipelineTab';
import NotificationDropdown from '../DonorDashboard/NotificationDropdown';
import { getOrgTypeLabel } from './orgUtils';

const Org = () => {
    const { user } = useAuth();
    return (
        <div>
            <div className='bg-black'>
                <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
                    <OrgSidebar />
                    <main className="flex-1 ml-0 md:ml-20 lg:ml-64 p-4 md:p-8 transition-all duration-300">
                        {/* Header */}
                        <header className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {user?.organizationName || user?.Name || 'Organization Portal'}
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    {getOrgTypeLabel(user?.organizationType)} · Manage inventory and requests
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <NotificationDropdown />
                            </div>
                        </header>

                        <Routes>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<OrgOverview />} />
                            <Route path="inventory" element={<InventoryView />} />
                            <Route path="donations" element={<DonationPipelineTab />} />
                            <Route path="requests" element={<MyRequestsPage />} />
                            <Route path="incoming" element={<IncomingRequestsPage />} />
                            <Route path="appointments" element={<AppointmentsTab />} />
                            <Route path="camps" element={<CampsTab />} />
                            <Route path="analytics" element={<AnalyticsTab />} />
                            <Route path="profile" element={<ProfileTab />} />
                            <Route path="*" element={<Navigate to="/org/dashboard" replace />} />
                        </Routes>

                    </main>
                </div>
            </div>
        </div>
    );
};

export default Org;

