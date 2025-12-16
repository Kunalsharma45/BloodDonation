import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { Wifi, WifiOff } from 'lucide-react';

const BackendHealthCheck = () => {
    const [status, setStatus] = useState('checking'); // checking, connected, disconnected

    useEffect(() => {
        const checkHealth = async () => {
            try {
                // Assuming we have a public endpoint or we use a light one
                // We'll use a simple login check or just assume client can reach server
                await client.get('/health'); // Need to ensure this route exists or use another one
                setStatus('connected');
            } catch (err) {
                console.error("Backend Check Failed:", err);
                setStatus('disconnected');
            }
        };

        const interval = setInterval(checkHealth, 5000);
        checkHealth(); // Initial check

        return () => clearInterval(interval);
    }, []);

    if (status === 'connected') {
        return (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg z-50">
                <Wifi size={14} /> Backend Connected
            </div>
        );
    }

    if (status === 'disconnected') {
        return (
            <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg z-50 animate-pulse">
                <WifiOff size={14} /> Backend Disconnected
            </div>
        );
    }

    return null;
};

export default BackendHealthCheck;
