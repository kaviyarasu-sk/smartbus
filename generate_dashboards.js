const fs = require('fs');
const path = require('path');

const frontendFiles = {
    'src/layouts/DashboardLayout.jsx': `import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Map, Bus, Users, LayoutDashboard, Route as RouteIcon } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'STUDENT', 'DRIVER'] },
    { name: 'Live Tracking', icon: Map, path: '/tracking', roles: ['ADMIN', 'STUDENT', 'DRIVER'] },
    { name: 'Buses', icon: Bus, path: '/buses', roles: ['ADMIN'] },
    { name: 'Routes', icon: RouteIcon, path: '/routes', roles: ['ADMIN'] },
    { name: 'Users', icon: Users, path: '/users', roles: ['ADMIN'] },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-indigo-700">SmartBus</div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.filter(item => item.roles.includes(user?.role)).map(item => (
            <Link key={item.name} to={item.path} className="flex items-center gap-3 p-3 rounded hover:bg-indigo-700 transition">
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-indigo-700">
          <div className="mb-4 text-sm">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-indigo-300">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-300 hover:text-red-100 transition w-full">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name}</h1>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
`,
    'src/pages/Dashboard.jsx': `import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboard from '../components/AdminDashboard';
import StudentDashboard from '../components/StudentDashboard';
import DriverDashboard from '../components/DriverDashboard';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const renderDashboard = () => {
    switch (user?.role) {
      case 'ADMIN': return <AdminDashboard />;
      case 'DRIVER': return <DriverDashboard />;
      case 'STUDENT': default: return <StudentDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
}
`,
    'src/components/AdminDashboard.jsx': `import { Bus, Users, Map, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Buses', value: '15', icon: Bus, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Drivers', value: '12', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Active Routes', value: '8', icon: Map, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Complaints', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={\`p-4 rounded-full \${stat.bg} \${stat.color}\`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-500">System activity will appear here.</p>
      </div>
    </div>
  );
}
`,
    'src/components/StudentDashboard.jsx': `import { Map, Clock, Bell } from 'lucide-react';

export default function StudentDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center cursor-pointer hover:shadow-md transition">
          <div className="mx-auto bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Map size={32} />
          </div>
          <h3 className="text-lg font-semibold">Track Live Bus</h3>
          <p className="text-sm text-gray-500 mt-2">Find where your bus is right now</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center cursor-pointer hover:shadow-md transition">
          <div className="mx-auto bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Clock size={32} />
          </div>
          <h3 className="text-lg font-semibold">Schedules</h3>
          <p className="text-sm text-gray-500 mt-2">View route timings and stops</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center cursor-pointer hover:shadow-md transition">
          <div className="mx-auto bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Bell size={32} />
          </div>
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p className="text-sm text-gray-500 mt-2">Recent alerts and delays</p>
        </div>
      </div>
    </div>
  );
}
`,
    'src/components/DriverDashboard.jsx': `import { Play, Square, MapPin } from 'lucide-react';

export default function DriverDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Driver Console</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700">Current Assignment</h3>
        <p><strong>Bus:</strong> TN-43-1234 (Route A)</p>
        <p><strong>Status:</strong> Idle</p>
      </div>
      <div className="flex gap-4">
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-center gap-2 font-bold transition">
          <Play size={24} /> Start Trip
        </button>
        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg flex items-center justify-center gap-2 font-bold transition">
          <Square size={24} /> End Trip
        </button>
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-center gap-2 font-bold transition">
          <MapPin size={24} /> Share Location
        </button>
      </div>
    </div>
  );
}
`
};

for (const [filepath, content] of Object.entries(frontendFiles)) {
    const fullPath = path.join('c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend', filepath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
}
