import { useState, useEffect } from 'react';
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
