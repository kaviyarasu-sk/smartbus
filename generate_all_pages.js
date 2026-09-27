const fs = require('fs');
const path = require('path');

const baseFrontend = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/src';

const files = {
    // Updated Student Dashboard with clickable cards
    'components/StudentDashboard.jsx': `import { useNavigate } from 'react-router-dom';
import { Map, Clock, Bell, MessageSquare, User } from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: 'Track Live Bus', desc: 'Find where your bus is right now', icon: Map, color: 'indigo', path: '/tracking' },
    { title: 'Schedules', desc: 'View route timings and stops', icon: Clock, color: 'green', path: '/schedules' },
    { title: 'Notifications', desc: 'Recent alerts and delays', icon: Bell, color: 'yellow', path: '/notifications' },
    { title: 'Complaints', desc: 'Submit or track complaints', icon: MessageSquare, color: 'red', path: '/complaints' },
    { title: 'My Profile', desc: 'View and edit your profile', icon: User, color: 'purple', path: '/profile' },
  ];

  const colorMap = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card.title} onClick={() => navigate(card.path)}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className={\`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 \${colorMap[card.color]}\`}>
              <card.icon size={32} />
            </div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
`,

    // Complaints Page
    'pages/Complaints.jsx': `import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Complaints() {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', category: 'Bus Delay', busNumber: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch (err) { console.error('Error fetching complaints'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', form);
      setMessage('Complaint submitted successfully!');
      setShowForm(false);
      setForm({ subject: '', description: '', category: 'Bus Delay', busNumber: '' });
      fetchComplaints();
    } catch (err) {
      setMessage('Error submitting complaint');
    }
  };

  const statusIcon = (status) => {
    switch(status) {
      case 'RESOLVED': return <CheckCircle className="text-green-500" size={18} />;
      case 'IN PROGRESS': return <Clock className="text-yellow-500" size={18} />;
      default: return <AlertCircle className="text-red-500" size={18} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Complaints</h2>
        {user?.role === 'STUDENT' && (
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
            <Send size={18} /> New Complaint
          </button>
        )}
      </div>

      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4">Submit New Complaint</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option>Bus Delay</option>
                <option>Driver Issue</option>
                <option>Route Issue</option>
                <option>Technical Issue</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Bus Number (optional)</label>
            <input type="text" value={form.busNumber} onChange={(e) => setForm({...form, busNumber: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" rows="4" required />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Submit</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Subject</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Admin Reply</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? complaints.map(c => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{c.subject}</td>
                <td className="p-4">{c.category}</td>
                <td className="p-4"><span className="flex items-center gap-2">{statusIcon(c.status)} {c.status}</span></td>
                <td className="p-4 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-sm">{c.adminReply || '-'}</td>
              </tr>
            )) : <tr><td colSpan="5" className="p-8 text-center text-gray-400">No complaints yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
`,

    // Notifications Page
    'pages/Notifications.jsx': `import { useState, useEffect } from 'react';
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
            className={\`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition hover:shadow-md \${!n.read ? 'border-l-4 border-l-indigo-500' : 'opacity-70'}\`}>
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
`,

    // Schedules Page
    'pages/Schedules.jsx': `import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Clock, MapPin, ArrowDown } from 'lucide-react';

export default function Schedules() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data } = await api.get('/routes');
        setRoutes(data);
      } catch (err) {
        setRoutes([
          { _id: '1', routeName: 'City Center to Campus', routeNumber: 'R1', startPoint: 'City Center', destination: 'Main Campus', stops: ['Pollachi', 'Kovilpalayam', 'Kinathukadavu', 'Udumalpet'], distance: 15, estimatedDuration: 45 },
          { _id: '2', routeName: 'Bus Station to Campus', routeNumber: 'R2', startPoint: 'Central Bus Station', destination: 'Main Campus', stops: ['Town Hall', 'Railway Station', 'Tech Park'], distance: 12, estimatedDuration: 35 },
        ]);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Bus Schedules & Routes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map(route => (
          <div key={route._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-indigo-700">{route.routeName}</h3>
                <span className="text-sm text-gray-400">Route #{route.routeNumber}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock size={14} /> {route.estimatedDuration || 45} mins
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">{route.startPoint}</span>
              <span className="text-gray-400">→</span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">{route.destination}</span>
            </div>

            {route.stops && route.stops.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Stops:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-green-500" />
                    <span className="text-sm font-medium">{route.startPoint}</span>
                  </div>
                  {route.stops.map((stop, i) => (
                    <div key={i} className="flex items-center gap-2 pl-1">
                      <ArrowDown size={12} className="text-gray-300" />
                      <span className="text-sm text-gray-600">{stop}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-red-500" />
                    <span className="text-sm font-medium">{route.destination}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-between text-sm text-gray-400">
              <span>Distance: {route.distance || '15'} km</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
`,

    // Profile Page
    'pages/Profile.jsx': `import { useContext } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, BookOpen, Hash } from 'lucide-react';

export default function Profile() {
  const { user } = useContext(AuthContext);

  const fields = [
    { label: 'Full Name', value: user?.name, icon: User },
    { label: 'Email', value: user?.email, icon: Mail },
    { label: 'Role', value: user?.role, icon: BookOpen },
  ];

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="bg-white rounded-lg shadow-sm border p-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
            <User size={40} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-gray-500">{user?.role}</p>
          </div>
        </div>
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <f.icon size={20} className="text-indigo-500" />
              <div>
                <p className="text-xs text-gray-400 uppercase">{f.label}</p>
                <p className="font-medium">{f.value || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
`,
};

// Write all files
for (const [filepath, content] of Object.entries(files)) {
    const fullPath = path.join(baseFrontend, filepath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
}

// Update DashboardLayout sidebar to have more menu items
const layoutPath = path.join(baseFrontend, 'layouts/DashboardLayout.jsx');
const layoutContent = `import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Map, Bus, Users, LayoutDashboard, Route as RouteIcon, Bell, MessageSquare, User, Clock, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'STUDENT', 'DRIVER'] },
    { name: 'Live Tracking', icon: Map, path: '/tracking', roles: ['ADMIN', 'STUDENT', 'DRIVER'] },
    { name: 'Schedules', icon: Clock, path: '/schedules', roles: ['STUDENT'] },
    { name: 'Buses', icon: Bus, path: '/buses', roles: ['ADMIN'] },
    { name: 'Routes', icon: RouteIcon, path: '/routes', roles: ['ADMIN'] },
    { name: 'Users', icon: Users, path: '/users', roles: ['ADMIN'] },
    { name: 'Complaints', icon: MessageSquare, path: '/complaints', roles: ['ADMIN', 'STUDENT'] },
    { name: 'Notifications', icon: Bell, path: '/notifications', roles: ['ADMIN', 'STUDENT', 'DRIVER'] },
    { name: 'My Profile', icon: User, path: '/profile', roles: ['STUDENT', 'DRIVER'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  const SidebarContent = () => (
    <>
      <div className="p-4 text-2xl font-bold border-b border-indigo-700 flex justify-between items-center">
        <span>🚌 SmartBus</span>
        <button className="md:hidden" onClick={() => setMobileOpen(false)}><X size={24} /></button>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {filteredNav.map(item => (
          <Link key={item.name} to={item.path} onClick={() => setMobileOpen(false)}
            className={\`flex items-center gap-3 p-3 rounded-lg transition \${location.pathname === item.path ? 'bg-indigo-900 text-white' : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'}\`}>
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-indigo-700">
        <div className="mb-4 text-sm">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-indigo-300 text-xs">{user?.role}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-300 hover:text-red-100 transition w-full">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-indigo-800 text-white flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-indigo-800 text-white flex flex-col z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMobileOpen(true)}><Menu size={24} /></button>
            <h1 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name}</h1>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
`;
fs.writeFileSync(layoutPath, layoutContent);

// Update App.jsx with all new routes
const appPath = path.join(baseFrontend, 'App.jsx');
const appContent = `import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LiveTracking from './pages/LiveTracking';
import Buses from './pages/Buses';
import RoutesPage from './pages/Routes';
import Complaints from './pages/Complaints';
import Notifications from './pages/Notifications';
import Schedules from './pages/Schedules';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tracking" element={<ProtectedRoute><LiveTracking /></ProtectedRoute>} />
          <Route path="/buses" element={<ProtectedRoute><Buses /></ProtectedRoute>} />
          <Route path="/routes" element={<ProtectedRoute><RoutesPage /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><div className="text-center"><h1 className="text-6xl font-bold text-gray-300">404</h1><p className="text-gray-500 mt-4">Page not found</p></div></div>} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
`;
fs.writeFileSync(appPath, appContent);

console.log('All pages and routes created successfully!');
