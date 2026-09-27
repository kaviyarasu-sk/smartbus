import { Link } from 'react-router-dom';
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
