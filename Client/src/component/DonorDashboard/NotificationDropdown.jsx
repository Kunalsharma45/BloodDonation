import { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import client from '../../api/client';
import { toast } from 'sonner';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await client.get('/api/notifications');
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optional: Poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await client.put(`/api/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await client.put('/api/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            toast.success("All notifications marked as read");
        } catch (err) {
            console.error(err);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                title="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-red-600 hover:text-red-700 hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-400 text-xs">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif._id}
                                    className={`px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${notif.read ? 'opacity-60' : 'bg-red-50/10'}`}
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.read ? 'bg-gray-300' : 'bg-red-500'}`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800">{notif.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {!notif.read && (
                                            <button
                                                onClick={() => markAsRead(notif._id)}
                                                className="self-start text-gray-300 hover:text-green-500 transition"
                                                title="Mark as read"
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
