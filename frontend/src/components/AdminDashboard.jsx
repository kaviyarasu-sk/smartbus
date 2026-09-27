import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Users, Map, AlertTriangle, Clock, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ buses: 0, drivers: 0, students: 0, complaints: 0, routes: 0, trips: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [busRes, routeRes, complaintRes] = await Promise.allSettled([
          api.get('/buses'), api.get('/routes'), api.get('/complaints')
        ]);
        setStats({
          buses: busRes.status === 'fulfilled' ? busRes.value.data.length : 5,
          routes: routeRes.status === 'fulfilled' ? routeRes.value.data.length : 3,
          complaints: complaintRes.status === 'fulfilled' ? complaintRes.value.data.length : 2,
          drivers: 3, students: 10, trips: 15
        });
      } catch (err) {
        setStats({ buses: 5, drivers: 3, students: 10, complaints: 2, routes: 3, trips: 15 });
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Buses', value: stats.buses, icon: Bus, color: 'blue', path: '/buses' },
    { title: 'Active Drivers', value: stats.drivers, icon: Users, color: 'green', path: '/users' },
    { title: 'Total Students', value: stats.students, icon: Users, color: 'purple', path: '/users' },
    { title: 'Active Routes', value: stats.routes, icon: Map, color: 'indigo', path: '/routes' },
    { title: 'Total Trips', value: stats.trips, icon: Clock, color: 'cyan', path: '/tracking' },
    { title: 'Complaints', value: stats.complaints, icon: AlertTriangle, color: 'red', path: '/complaints' },
  ];

  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {cards.map(card => (
          <div key={card.title} onClick={() => navigate(card.path)}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className={"p-4 rounded-xl " + colorMap[card.color]}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity size={20} className="text-indigo-600" /> Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/buses')} className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition flex items-center gap-3">
              <Bus size={18} className="text-indigo-600" /> Manage Buses
            </button>
            <button onClick={() => navigate('/routes')} className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition flex items-center gap-3">
              <Map size={18} className="text-indigo-600" /> Manage Routes
            </button>
            <button onClick={() => navigate('/tracking')} className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition flex items-center gap-3">
              <TrendingUp size={18} className="text-indigo-600" /> Live Tracking
            </button>
            <button onClick={() => navigate('/complaints')} className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition flex items-center gap-3">
              <AlertTriangle size={18} className="text-indigo-600" /> View Complaints
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Recent Activity</h3>
          <div className="space-y-3">
            {[
              { text: 'Bus 101 started trip on Route R1', time: '2 min ago', color: 'green' },
              { text: 'New student registered: kaviyarasu sk', time: '15 min ago', color: 'blue' },
              { text: 'Complaint submitted: Bus Delay on Bus 202', time: '1 hour ago', color: 'red' },
              { text: 'Route R2 updated with new stop', time: '3 hours ago', color: 'purple' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={"w-2 h-2 rounded-full mt-2 bg-" + item.color + "-500"}></div>
                <div>
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
