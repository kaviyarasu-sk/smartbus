import { Link } from 'react-router-dom';
import {
  Bus,
  MapPin,
  Shield,
  Clock,
  Users,
  ChevronRight,
  Map,
  Bell,
  Star,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Navigation
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-indigo-500 selection:text-white">
      {/* Modern Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Bus size={22} />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                SmartBus
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                IoT & GPS Live
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition">How It Works</a>
            <a href="#live-preview" className="hover:text-indigo-600 transition">Live Demo</a>
            <a href="#about" className="hover:text-indigo-600 transition">About</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-bold text-gray-700 hover:text-indigo-600 px-3 py-2 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 text-white py-20 lg:py-32">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Hero Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-indigo-200 mb-6">
              <Sparkles size={14} className="text-yellow-400" /> Smart Campus Transportation System
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              Track Your College Bus.<br />
              <span className="bg-gradient-to-r from-indigo-200 via-sky-200 to-purple-200 bg-clip-text text-transparent">
                Travel Smarter & Safer.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-indigo-100/90 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Real-time GPS bus location tracking, instant arrival estimations, interactive route map picker, and automated alert notifications built for students, drivers, and campus administrators.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
              <Link
                to="/login"
                className="bg-white text-indigo-900 hover:bg-indigo-50 px-8 py-3.5 rounded-xl font-bold text-base transition flex items-center justify-center gap-2.5 shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95"
              >
                <Navigation size={18} className="text-indigo-600" />
                Track Live Bus Now
              </Link>
              <Link
                to="/register"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold text-base transition flex items-center justify-center gap-2 backdrop-blur-sm hover:scale-[1.02] active:scale-95"
              >
                Student Registration <ChevronRight size={18} />
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-2xl font-black text-white">99.8%</p>
                <p className="text-xs text-indigo-200">On-Time Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">&lt; 3 Secs</p>
                <p className="text-xs text-indigo-200">GPS Live Refresh</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-indigo-200">Free Open Maps</p>
              </div>
            </div>
          </div>

          {/* Right Hero Interactive Transport Card Visual */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <div className="relative mx-auto bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              {/* Radar Live Bus Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-6 h-6 bg-green-500 rounded-full animate-ping opacity-75"></span>
                    <span className="relative w-3.5 h-3.5 bg-green-500 rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Campus Bus 101 (TN-43-1234)</h3>
                    <p className="text-xs text-indigo-300">Route R1: City Center ➔ Main Campus</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/30 px-2.5 py-1 rounded-full">
                  48 km/h
                </span>
              </div>

              {/* Progress Stepper Line */}
              <div className="py-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-indigo-200 font-semibold">
                  <span className="text-green-400 font-bold flex items-center gap-1">● City Center</span>
                  <span className="text-yellow-400 font-bold flex items-center gap-1">🚌 In Transit (Kinathukadavu)</span>
                  <span className="text-white font-bold flex items-center gap-1">🏁 Campus Gate</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-green-400 via-indigo-400 to-purple-400 h-full rounded-full w-2/3 animate-pulse"></div>
                </div>
              </div>

              {/* ETA Cards Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Estimated Arrival</p>
                  <p className="text-xl font-extrabold text-white mt-0.5">08 Mins</p>
                  <p className="text-[11px] text-green-400 font-semibold mt-1">● On Schedule</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Seats Status</p>
                  <p className="text-xl font-extrabold text-white mt-0.5">14 Free</p>
                  <p className="text-[11px] text-indigo-300 font-semibold mt-1">Capacity 50</p>
                </div>
              </div>

              {/* Map Point Selector Teaser */}
              <div className="mt-4 p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-indigo-200">
                  <MapPin size={16} className="text-red-400" />
                  <span>Clickable Map Location Picker Enabled</span>
                </div>
                <Link to="/login" className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition">
                  Open Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Engineered for Modern Universities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 tracking-tight">
            Everything You Need for Campus Transit
          </h2>
          <p className="text-gray-500 mt-3 text-sm sm:text-base">
            Cutting-edge features designed to keep students informed, drivers on schedule, and administration in control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Map, title: 'Click-to-Pick Map Location', desc: 'Touch or click anywhere on the live OpenStreetMap to pick any custom pickup point or destination with automatic ETA calculations.', color: 'indigo' },
            { icon: Zap, title: 'Real-Time Socket.IO GPS', desc: 'Continuous sub-second live GPS bus movement updates broadcasted live directly to your smartphone browser without refresh.', color: 'amber' },
            { icon: Clock, title: 'Dynamic Schedules & Routes', desc: 'Select any From and To location with smart autocomplete search, intermediate stops breakdown, and distance tracking.', color: 'emerald' },
            { icon: Users, title: 'Multi-Role Role Dashboards', desc: 'Role-based authorization for Students (ETA & Tracking), Drivers (Start/End Trip Controls), and Admins (Fleet Management).', color: 'blue' },
            { icon: Bell, title: 'Alerts & Delay Notifications', desc: 'Instant automated alerts on bus departure, unexpected delay notices, route shifts, and direct grievance redressal.', color: 'purple' },
            { icon: Shield, title: 'PWA Mobile App Experience', desc: 'Installable directly to Android and iPhone Home Screens with standalone fullscreen mode — no app store payment needed!', color: 'rose' },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                <f.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-indigo-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Ready to Experience Smart College Travel?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Join students and staff tracking college transportation live right now from any smartphone or laptop.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Link
              to="/register"
              className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-3.5 rounded-xl shadow-lg transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold px-8 py-3.5 rounded-xl border border-indigo-400 transition"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Bus size={18} className="text-indigo-400" />
            <span className="font-bold text-white text-sm">SmartBus Tracking & Management System</span>
          </div>
          <p>© 2026 SmartBus. Built for modern university transportation.</p>
        </div>
      </footer>
    </div>
  );
}
