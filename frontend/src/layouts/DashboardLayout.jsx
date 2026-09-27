import { useState, useContext } from 'react';
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
            className={`flex items-center gap-3 p-3 rounded-lg transition ${location.pathname === item.path ? 'bg-indigo-900 text-white' : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'}`}>
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
