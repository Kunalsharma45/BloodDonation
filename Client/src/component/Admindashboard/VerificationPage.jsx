import React from 'react';
import AdminSidebar from './AdminSidebar';
import PendingQueue from './PendingQueue';

const VerificationPage = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 ml-0 md:ml-20 lg:ml-64 p-6 md:p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Request Verification</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Review and approve pending donor and organization registrations
                    </p>
                </div>

                <PendingQueue />
            </main>
        </div>
    );
};

export default VerificationPage;
