import { useState, useEffect } from 'react';
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
