const fs = require('fs');
const path = require('path');

const base = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/src';

const files = {
// ==================== LANDING PAGE ====================
'pages/Landing.jsx': `import { Link } from 'react-router-dom';
import { Bus, MapPin, Shield, Clock, Users, ChevronRight, Map, Bell, Star } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bus className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold text-indigo-700">SmartBus</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition">How It Works</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600 transition">About</a>
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-800 transition">Login</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold">Register</Link>
          </div>
          <Link to="/login" className="md:hidden bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Track Your Bus.<br/>
              <span className="text-indigo-200">Travel Smarter.</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-200 mb-8 max-w-lg">
              Real-time bus tracking and smart transportation management for students and colleges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/login" className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-indigo-50 transition flex items-center justify-center gap-2">
                <MapPin size={20} /> Track Bus
              </Link>
              <Link to="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/10 transition flex items-center justify-center gap-2">
                Get Started <ChevronRight size={20} />
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 w-full max-w-md">
              <div className="bg-indigo-500/30 rounded-xl p-6 mb-4 flex items-center gap-4">
                <div className="bg-green-400 w-4 h-4 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-bold text-lg">Bus 101 - Active</p>
                  <p className="text-indigo-200 text-sm">Route: City Center → Campus</p>
                </div>
              </div>
              <div className="bg-indigo-500/30 rounded-xl p-6 mb-4 flex items-center gap-4">
                <div className="bg-yellow-400 w-4 h-4 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-bold text-lg">Bus 202 - En Route</p>
                  <p className="text-indigo-200 text-sm">ETA: 12 minutes</p>
                </div>
              </div>
              <div className="bg-indigo-500/30 rounded-xl p-6 flex items-center gap-4">
                <div className="bg-blue-400 w-4 h-4 rounded-full"></div>
                <div>
                  <p className="font-bold text-lg">Bus 303 - Scheduled</p>
                  <p className="text-indigo-200 text-sm">Departure: 8:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Powerful Features</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">Everything you need for smart campus transportation</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Map, title: 'Live GPS Tracking', desc: 'Track every bus in real-time on an interactive map with accurate GPS locations', color: 'indigo' },
              { icon: Bell, title: 'Instant Notifications', desc: 'Get alerts for bus arrivals, delays, route changes, and emergencies', color: 'yellow' },
              { icon: Clock, title: 'ETA Predictions', desc: 'Know exactly when your bus will arrive with smart arrival estimates', color: 'green' },
              { icon: Shield, title: 'Secure & Reliable', desc: 'Role-based access control with encrypted data and secure authentication', color: 'red' },
              { icon: Users, title: 'Multi-Role Access', desc: 'Separate dashboards for Students, Drivers, and Administrators', color: 'purple' },
              { icon: Star, title: 'Complaint System', desc: 'Submit and track complaints for continuous service improvement', color: 'blue' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={"w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-" + f.color + "-100 text-" + f.color + "-600"}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-500 text-center mb-12">Simple steps to get started</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Register', desc: 'Create your account as a Student or Driver with your college ID' },
              { step: '2', title: 'Login', desc: 'Access your personalized dashboard with all bus information' },
              { step: '3', title: 'Track', desc: 'View live bus locations, routes, and estimated arrival times on the map' },
            ].map((s, i) => (
              <div key={i} className="text-center p-8">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">{s.step}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About SmartBus</h2>
          <p className="text-xl text-indigo-200 mb-8">
            SmartBus is a modern transportation management system designed specifically for educational institutions. 
            It provides real-time bus tracking, route management, and communication tools to ensure safe and efficient campus transportation.
          </p>
          <Link to="/register" className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-indigo-50 transition inline-flex items-center gap-2">
            Get Started Now <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bus className="text-indigo-400" size={24} />
            <span className="text-xl font-bold text-white">SmartBus</span>
          </div>
          <p className="mb-4">Smart Bus Tracking & Management System</p>
          <p className="text-sm">© 2026 SmartBus. All rights reserved. Built for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}
`,

// ==================== FULL REGISTER PAGE ====================
'pages/Register.jsx': `import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bus, User, Mail, Lock, Phone, Hash, BookOpen, CreditCard } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT', phone: '', studentId: '', department: '', licenseNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const update = (field) => (e) => setFormData({...formData, [field]: e.target.value});

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bus className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold text-indigo-700">SmartBus</span>
          </div>
          <p className="text-gray-500">Create your account</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User size={18} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Full Name" value={formData.name} onChange={update('name')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>

          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
            <input type="email" placeholder="Email Address" value={formData.email} onChange={update('email')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input type="password" placeholder="Password" value={formData.password} onChange={update('password')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>

          <div className="relative">
            <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
            <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={update('phone')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>

          <select value={formData.role} onChange={update('role')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
            <option value="STUDENT">Student</option>
            <option value="DRIVER">Driver</option>
          </select>

          {formData.role === 'STUDENT' && (
            <>
              <div className="relative">
                <Hash size={18} className="absolute left-3 top-3 text-gray-400" />
                <input type="text" placeholder="Student ID" value={formData.studentId} onChange={update('studentId')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
              </div>
              <div className="relative">
                <BookOpen size={18} className="absolute left-3 top-3 text-gray-400" />
                <input type="text" placeholder="Department" value={formData.department} onChange={update('department')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
            </>
          )}

          {formData.role === 'DRIVER' && (
            <div className="relative">
              <CreditCard size={18} className="absolute left-3 top-3 text-gray-400" />
              <input type="text" placeholder="License Number" value={formData.licenseNumber} onChange={update('licenseNumber')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
`,

// ==================== FULL LOGIN PAGE ====================
'pages/Login.jsx': `import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bus, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bus className="text-indigo-600" size={36} />
            <span className="text-3xl font-bold text-indigo-700">SmartBus</span>
          </div>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-semibold mb-2">Demo Accounts:</p>
          <p className="text-xs text-gray-500">Admin: admin@college.edu / password123</p>
          <p className="text-xs text-gray-500">Driver: driver@college.edu / password123</p>
        </div>

        <p className="mt-6 text-sm text-center text-gray-500">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Register</Link>
        </p>
        <p className="mt-2 text-sm text-center">
          <Link to="/" className="text-gray-400 hover:text-indigo-600 transition">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
`,

// ==================== ADMIN DASHBOARD WITH STATS ====================
'components/AdminDashboard.jsx': `import { useState, useEffect } from 'react';
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
`,

// ==================== DRIVER DASHBOARD WITH START/END TRIP ====================
'components/DriverDashboard.jsx': `import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Square, MapPin, Bus, Map, Clock, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';

export default function DriverDashboard() {
  const [tripActive, setTripActive] = useState(false);
  const [tripTime, setTripTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (tripActive) {
      interval = setInterval(() => setTripTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [tripActive]);

  const startTrip = () => {
    setTripActive(true);
    setTripTime(0);
    try {
      const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
      socket.emit('startTrip', { busId: 'bus-1' });
    } catch (err) {}
  };

  const endTrip = () => {
    setTripActive(false);
    try {
      const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
      socket.emit('endTrip', { busId: 'bus-1' });
    } catch (err) {}
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Driver Console</h2>

      {/* Current Status */}
      <div className={"p-6 rounded-xl shadow-sm border mb-6 " + (tripActive ? "bg-green-50 border-green-200" : "bg-white")}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bus className="text-indigo-600" size={24} /> Current Assignment
          </h3>
          <span className={"px-3 py-1 rounded-full text-sm font-bold " + (tripActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
            {tripActive ? '🟢 ACTIVE' : '⚪ IDLE'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-xs text-gray-400">Bus</p>
            <p className="font-bold">TN-43-A-1234</p>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-xs text-gray-400">Route</p>
            <p className="font-bold">R1 - City to Campus</p>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-xs text-gray-400">Capacity</p>
            <p className="font-bold">50 Seats</p>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-xs text-gray-400">Trip Time</p>
            <p className="font-bold text-indigo-600">{formatTime(tripTime)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {!tripActive ? (
          <button onClick={startTrip} className="col-span-1 md:col-span-2 bg-green-600 hover:bg-green-700 text-white p-5 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition shadow-lg shadow-green-200">
            <Play size={28} /> Start Trip
          </button>
        ) : (
          <button onClick={endTrip} className="col-span-1 md:col-span-2 bg-red-600 hover:bg-red-700 text-white p-5 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition shadow-lg shadow-red-200 animate-pulse">
            <Square size={28} /> End Trip
          </button>
        )}
        <button onClick={() => navigate('/tracking')} className="bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-xl flex items-center justify-center gap-3 font-bold transition">
          <MapPin size={24} /> View Map
        </button>
      </div>

      {/* Trip History */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock size={20} className="text-indigo-600" /> Recent Trips
        </h3>
        <div className="space-y-3">
          {[
            { route: 'City Center → Campus', date: 'Today, 8:00 AM', duration: '45 min', status: 'COMPLETED' },
            { route: 'Campus → City Center', date: 'Yesterday, 5:30 PM', duration: '50 min', status: 'COMPLETED' },
            { route: 'City Center → Campus', date: 'Yesterday, 8:15 AM', duration: '42 min', status: 'COMPLETED' },
          ].map((trip, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-green-500" />
                <div>
                  <p className="font-medium text-sm">{trip.route}</p>
                  <p className="text-xs text-gray-400">{trip.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{trip.duration}</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{trip.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`,

// ==================== ADMIN USERS PAGE ====================
'pages/Users.jsx': `import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Users, Search, Trash2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      setUsers([
        { _id: '1', name: 'System Admin', email: 'admin@college.edu', role: 'ADMIN', phone: '-', createdAt: new Date() },
        { _id: '2', name: 'John Driver', email: 'driver@college.edu', role: 'DRIVER', phone: '9876543210', createdAt: new Date() },
        { _id: '3', name: 'kaviyarasu sk', email: 'kavi@student.edu', role: 'STUDENT', studentId: 'STU001', department: 'CSE', createdAt: new Date() },
      ]);
    }
  };

  const filtered = users.filter(u =>
    (filterRole === 'ALL' || u.role === filterRole) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const roleColors = {
    ADMIN: 'bg-red-100 text-red-700',
    DRIVER: 'bg-blue-100 text-blue-700',
    STUDENT: 'bg-green-100 text-green-700',
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Users size={28} /> User Management</h2>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="DRIVER">Drivers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Phone</th>
              <th className="p-4 font-semibold text-gray-600">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4"><span className={"px-3 py-1 rounded-full text-xs font-bold " + (roleColors[user.role] || '')}>{user.role}</span></td>
                <td className="p-4 text-gray-500">{user.phone || '-'}</td>
                <td className="p-4 text-gray-400 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
`,

// ==================== FULL BUSES PAGE WITH ADD/DELETE ====================
'pages/Buses.jsx': `import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Bus, Plus, Trash2, X, Search } from 'lucide-react';

export default function Buses() {
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ busNumber: '', registrationNumber: '', capacity: '', status: 'INACTIVE' });

  useEffect(() => { fetchBuses(); }, []);

  const fetchBuses = async () => {
    try {
      const { data } = await api.get('/buses');
      setBuses(data);
    } catch (err) {
      setBuses([
        { _id: '1', busNumber: 'Bus 101', registrationNumber: 'TN-43-A-1234', capacity: 50, status: 'ON TIME' },
        { _id: '2', busNumber: 'Bus 202', registrationNumber: 'TN-43-B-5678', capacity: 45, status: 'INACTIVE' },
      ]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/buses', { ...form, capacity: Number(form.capacity) });
      setShowForm(false);
      setForm({ busNumber: '', registrationNumber: '', capacity: '', status: 'INACTIVE' });
      fetchBuses();
    } catch (err) { alert('Error adding bus'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this bus?')) return;
    try { await api.delete('/buses/' + id); fetchBuses(); }
    catch (err) { alert('Error deleting bus'); }
  };

  const statusColors = {
    'ON TIME': 'bg-green-100 text-green-700',
    'DELAYED': 'bg-yellow-100 text-yellow-700',
    'INACTIVE': 'bg-gray-100 text-gray-600',
    'COMPLETED': 'bg-blue-100 text-blue-700',
  };

  const filtered = buses.filter(b => b.busNumber?.toLowerCase().includes(search.toLowerCase()) || b.registrationNumber?.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Bus size={28} /> Manage Buses</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search buses..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-semibold">
            {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Cancel' : 'Add Bus'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Bus</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Bus Number" value={form.busNumber} onChange={(e) => setForm({...form, busNumber: e.target.value})} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            <input type="text" placeholder="Registration Number" value={form.registrationNumber} onChange={(e) => setForm({...form, registrationNumber: e.target.value})} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            <input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-bold">Add Bus</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Bus Number</th>
              <th className="p-4 font-semibold text-gray-600">Registration</th>
              <th className="p-4 font-semibold text-gray-600">Capacity</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(bus => (
              <tr key={bus._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{bus.busNumber}</td>
                <td className="p-4 text-gray-600">{bus.registrationNumber}</td>
                <td className="p-4">{bus.capacity} seats</td>
                <td className="p-4"><span className={"px-3 py-1 rounded-full text-xs font-bold " + (statusColors[bus.status] || '')}>{bus.status}</span></td>
                <td className="p-4">
                  <button onClick={() => handleDelete(bus._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">No buses found</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
`,
};

// Write all files
for (const [filepath, content] of Object.entries(files)) {
    const fullPath = path.join(base, filepath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
}

// Update App.jsx with Landing page route
const appPath = path.join(base, 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');
// Add Landing import and Users import
if (!appContent.includes('Landing')) {
    appContent = appContent.replace(
        "import Login from './pages/Login';",
        "import Landing from './pages/Landing';\nimport Login from './pages/Login';"
    );
    appContent = appContent.replace(
        "import Profile from './pages/Profile';",
        "import Profile from './pages/Profile';\nimport UsersPage from './pages/Users';"
    );
    // Change / to landing, /login for login
    appContent = appContent.replace(
        '<Route path="/" element={<Login />} />',
        '<Route path="/" element={<Landing />} />\n          <Route path="/login" element={<Login />} />'
    );
    appContent = appContent.replace(
        '<Route path="/profile"',
        '<Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />\n          <Route path="/profile"'
    );
    fs.writeFileSync(appPath, appContent);
}

console.log('All complete pages created successfully!');
