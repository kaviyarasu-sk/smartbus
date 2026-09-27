import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Bell, CheckCircle, AlertTriangle, Info, Bus } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      // Use demo notifications if API not available
      setNotifications([
        { _id: '1', title: 'Bus 101 Started', message: 'Bus 101 has started from City Center towards Main Campus', type: 'info', read: false, createdAt: new Date() },
        { _id: '2', title: 'Route Change', message: 'Route R1 has been updated with a new stop at Kovilpalayam', type: 'warning', read: false, createdAt: new Date(Date.now() - 3600000) },
        { _id: '3', title: 'Bus Arrived', message: 'Bus 101 has arrived at Main Campus', type: 'success', read: true, createdAt: new Date(Date.now() - 7200000) },
      ]);
    }
  };

  const markRead = async (id) => {
    try { await api.put('/notifications/' + id + '/read'); }
    catch (err) {}
    setNotifications(prev => prev.map(n => n._id === id ? {...n, read: true} : n));
  };

  const iconMap = {
    info: <Info className="text-blue-500" size={20} />,
    warning: <AlertTriangle className="text-yellow-500" size={20} />,
    success: <CheckCircle className="text-green-500" size={20} />,
    bus: <Bus className="text-indigo-500" size={20} />,
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">{notifications.filter(n => !n.read).length} unread</span>
      </div>
      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n._id} onClick={() => markRead(n._id)}
            className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition hover:shadow-md ${!n.read ? 'border-l-4 border-l-indigo-500' : 'opacity-70'}`}>
            <div className="flex items-start gap-3">
              {iconMap[n.type] || iconMap.info}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{n.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.read && <span className="w-3 h-3 bg-indigo-500 rounded-full mt-1"></span>}
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
