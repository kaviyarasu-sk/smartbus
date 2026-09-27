import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Clock, MapPin, ArrowRight, Search, RefreshCw, Bus } from 'lucide-react';

export default function Schedules() {
  const [routes, setRoutes] = useState([]);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const { data } = await api.get('/routes');
      setRoutes(data);
      setFilteredRoutes(data);
    } catch (err) {
      const demoData = [
        { _id: '1', routeName: 'City Center to Main Campus', routeNumber: 'R1', startPoint: 'City Center', destination: 'Main Campus', stops: ['Pollachi', 'Kovilpalayam', 'Kinathukadavu', 'Udumalpet'], distance: 15, estimatedDuration: 45, timing: '07:30 AM & 08:15 AM' },
        { _id: '2', routeName: 'Central Bus Station to Main Campus', routeNumber: 'R2', startPoint: 'Central Bus Station', destination: 'Main Campus', stops: ['Town Hall', 'Railway Station', 'Tech Park'], distance: 12, estimatedDuration: 35, timing: '07:45 AM & 08:30 AM' },
        { _id: '3', routeName: 'Railway Station to Main Campus', routeNumber: 'R3', startPoint: 'Railway Station', destination: 'Main Campus', stops: ['Gandhi Statue', 'Collectorate', 'Airport Road'], distance: 18, estimatedDuration: 50, timing: '07:15 AM & 08:00 AM' },
      ];
      setRoutes(demoData);
      setFilteredRoutes(demoData);
    }
  };

  // Get all unique start points, destinations, and stops for filter dropdowns
  const allLocations = Array.from(
    new Set(
      routes.flatMap(r => [r.startPoint, r.destination, ...(r.stops || [])]).filter(Boolean)
    )
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const results = routes.filter(route => {
      const routeLocations = [route.startPoint, route.destination, ...(route.stops || [])].map(l => l?.toLowerCase());
      
      const matchFrom = !fromLocation || routeLocations.some(loc => loc.includes(fromLocation.toLowerCase()));
      const matchTo = !toLocation || routeLocations.some(loc => loc.includes(toLocation.toLowerCase()));

      return matchFrom && matchTo;
    });
    setFilteredRoutes(results);
  };

  const handleReset = () => {
    setFromLocation('');
    setToLocation('');
    setFilteredRoutes(routes);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="text-indigo-600" size={28} /> Bus Schedules & Route Finder
          </h2>
          <p className="text-gray-500 text-sm mt-1">Search for buses between your starting point and destination</p>
        </div>
      </div>

      {/* Interactive From - To Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          
          {/* FROM Dropdown / Input */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin size={14} className="text-green-500" /> From (Starting Point)
            </label>
            <div className="relative">
              <input
                type="text"
                list="from-locations"
                placeholder="e.g. City Center or Pollachi"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-medium bg-gray-50 focus:bg-white"
              />
              <datalist id="from-locations">
                {allLocations.map((loc, i) => (
                  <option key={i} value={loc} />
                ))}
              </datalist>
            </div>
          </div>

          {/* ARROW */}
          <div className="hidden md:flex justify-center items-center pt-5">
            <ArrowRight size={20} className="text-indigo-400" />
          </div>

          {/* TO Dropdown / Input */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin size={14} className="text-red-500" /> To (Destination)
            </label>
            <div className="relative">
              <input
                type="text"
                list="to-locations"
                placeholder="e.g. Main Campus"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-medium bg-gray-50 focus:bg-white"
              />
              <datalist id="to-locations">
                {allLocations.map((loc, i) => (
                  <option key={i} value={loc} />
                ))}
              </datalist>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="md:col-span-7 flex justify-end gap-3 mt-2">
            {(fromLocation || toLocation) && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm border text-gray-600 rounded-lg hover:bg-gray-50 transition flex items-center gap-1"
              >
                <RefreshCw size={14} /> Clear Filter
              </button>
            )}
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Search size={16} /> Find Bus Routes
            </button>
          </div>

        </form>
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoutes.map(route => (
          <div key={route._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md mb-2 inline-block">
                  Route #{route.routeNumber}
                </span>
                <h3 className="text-lg font-bold text-gray-800">{route.routeName}</h3>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                <Clock size={14} /> {route.estimatedDuration || 45} mins
              </div>
            </div>

            {/* Timings Badge */}
            {route.timing && (
              <div className="mb-4 text-xs bg-yellow-50 text-yellow-800 p-2 rounded-lg border border-yellow-100 flex items-center gap-1.5 font-medium">
                <Bus size={14} className="text-yellow-600" /> Departure Timings: {route.timing}
              </div>
            )}

            <div className="flex items-center gap-2 mb-4 bg-gray-50 p-3 rounded-lg">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{route.startPoint}</span>
              <ArrowRight size={16} className="text-gray-400" />
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">{route.destination}</span>
            </div>

            {route.stops && route.stops.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <p className="text-xs font-bold uppercase text-gray-400 mb-3">Intermediate Bus Stops:</p>
                <div className="flex flex-wrap gap-2">
                  {route.stops.map((stop, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> {stop}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 border-t pt-3 flex justify-between text-xs text-gray-400 font-medium">
              <span>Total Distance: {route.distance || '15'} km</span>
              <span className="text-green-600 font-bold">● Operational</span>
            </div>
          </div>
        ))}

        {filteredRoutes.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-xl border">
            <Bus size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No Routes Found</h3>
            <p className="text-sm text-gray-400 mt-1">No bus routes match your "From" ({fromLocation}) and "To" ({toLocation}) search.</p>
            <button onClick={handleReset} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              View All Routes
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
