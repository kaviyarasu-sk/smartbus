import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Clock, MapPin, ArrowRight, Search, RefreshCw, Bus, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

export default function Schedules() {
  const [routes, setRoutes] = useState([]);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  const defaultDemoRoutes = [
    { _id: '1', routeName: 'City Center to Main Campus', routeNumber: 'R1', startPoint: 'City Center', destination: 'Main Campus', stops: ['Pollachi', 'Kovilpalayam', 'Kinathukadavu', 'Udumalpet'], distance: 15, estimatedDuration: 45, timing: '07:30 AM & 08:15 AM' },
    { _id: '2', routeName: 'Central Bus Station to Main Campus', routeNumber: 'R2', startPoint: 'Central Bus Station', destination: 'Main Campus', stops: ['Town Hall', 'Railway Station', 'Tech Park'], distance: 12, estimatedDuration: 35, timing: '07:45 AM & 08:30 AM' },
    { _id: '3', routeName: 'Railway Station to Main Campus', routeNumber: 'R3', startPoint: 'Railway Station', destination: 'Main Campus', stops: ['Gandhi Statue', 'Collectorate', 'Airport Road'], distance: 18, estimatedDuration: 50, timing: '07:15 AM & 08:00 AM' },
  ];

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const { data } = await api.get('/routes');
      if (data && data.length > 0) {
        setRoutes(data);
        setFilteredRoutes(data);
      } else {
        setRoutes(defaultDemoRoutes);
        setFilteredRoutes(defaultDemoRoutes);
      }
    } catch (err) {
      setRoutes(defaultDemoRoutes);
      setFilteredRoutes(defaultDemoRoutes);
    }
  };

  // Extract all distinct locations (Starting points, Destinations, and Intermediate stops)
  const allLocations = Array.from(
    new Set(
      routes.flatMap(r => [r.startPoint, r.destination, ...(r.stops || [])]).filter(Boolean)
    )
  ).sort();

  // Instant filter whenever From or To changes
  useEffect(() => {
    const results = routes.filter(route => {
      const routeLocations = [route.startPoint, route.destination, ...(route.stops || [])].map(l => l?.toLowerCase().trim());
      
      const matchFrom = !fromLocation || routeLocations.some(loc => loc.includes(fromLocation.toLowerCase().trim()));
      const matchTo = !toLocation || routeLocations.some(loc => loc.includes(toLocation.toLowerCase().trim()));

      return matchFrom && matchTo;
    });
    setFilteredRoutes(results);
  }, [fromLocation, toLocation, routes]);

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleReset = () => {
    setFromLocation('');
    setToLocation('');
    setFilteredRoutes(routes);
  };

  const handleSelectQuickLocation = (loc) => {
    if (!fromLocation) {
      setFromLocation(loc);
    } else if (!toLocation && toLocation !== loc) {
      setToLocation(loc);
    } else {
      setFromLocation(loc);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="text-indigo-600" size={28} /> Bus Schedules & Route Finder
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Select your From and To location from the dropdown list below
          </p>
        </div>
        {(fromLocation || toLocation) && (
          <button
            onClick={handleReset}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg transition flex items-center gap-1 font-semibold"
          >
            <RefreshCw size={12} /> Clear Filter
          </button>
        )}
      </div>

      {/* Main Interactive Location Selector Box */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          
          {/* FROM Location Selector */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
              From (Starting Location):
            </label>
            <div className="relative">
              <select
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full p-3 border-2 border-green-200 rounded-xl bg-green-50/40 text-gray-800 font-semibold text-sm focus:border-green-500 focus:bg-white focus:outline-none cursor-pointer appearance-none transition"
              >
                <option value="">📍 Choose / Select Starting Point</option>
                {allLocations.map((loc, i) => (
                  <option key={i} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                ▼
              </div>
            </div>
          </div>

          {/* SWAP BUTTON */}
          <div className="md:col-span-1 flex justify-center items-center pt-2 md:pt-5">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap From and To"
              className="p-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition shadow-sm hover:scale-105 active:scale-95"
            >
              <ArrowLeftRight size={18} />
            </button>
          </div>

          {/* TO Location Selector */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              To (Destination Location):
            </label>
            <div className="relative">
              <select
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full p-3 border-2 border-red-200 rounded-xl bg-red-50/40 text-gray-800 font-semibold text-sm focus:border-red-500 focus:bg-white focus:outline-none cursor-pointer appearance-none transition"
              >
                <option value="">🎯 Choose / Select Destination</option>
                {allLocations.map((loc, i) => (
                  <option key={i} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                ▼
              </div>
            </div>
          </div>

        </div>

        {/* Quick Location Pills (Tap to Select) */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Quick Select Locations (Tap to choose):
          </p>
          <div className="flex flex-wrap gap-2">
            {allLocations.slice(0, 10).map((loc, idx) => {
              const isSelectedFrom = fromLocation === loc;
              const isSelectedTo = toLocation === loc;
              let pillStyle = "bg-gray-100 text-gray-700 hover:bg-gray-200";
              if (isSelectedFrom) pillStyle = "bg-green-600 text-white font-bold shadow-sm";
              if (isSelectedTo) pillStyle = "bg-red-600 text-white font-bold shadow-sm";

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuickLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 font-medium ${pillStyle}`}
                >
                  <MapPin size={12} /> {loc}
                  {isSelectedFrom && <span className="text-[10px] ml-1">(From)</span>}
                  {isSelectedTo && <span className="text-[10px] ml-1">(To)</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Selection Status Banner */}
        {(fromLocation || toLocation) && (
          <div className="mt-4 bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between text-xs text-indigo-900 font-semibold">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Showing buses for:</span>
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">
                From: {fromLocation || 'Any'}
              </span>
              <span>➔</span>
              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                To: {toLocation || 'Any'}
              </span>
            </div>
            <span className="text-indigo-600 font-bold">
              {filteredRoutes.length} route(s) found
            </span>
          </div>
        )}
      </div>

      {/* Routes Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRoutes.map(route => (
          <div
            key={route._id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-md mb-1.5 inline-block">
                  Route #{route.routeNumber}
                </span>
                <h3 className="text-base font-bold text-gray-800">{route.routeName}</h3>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                <Clock size={12} /> {route.estimatedDuration || 45} mins
              </div>
            </div>

            {/* Timings */}
            {route.timing && (
              <div className="mb-3 text-xs bg-amber-50 text-amber-900 p-2 rounded-lg border border-amber-100 flex items-center gap-1.5 font-medium">
                <Bus size={13} className="text-amber-600" /> Timings: {route.timing}
              </div>
            )}

            {/* From - To Path Box */}
            <div className="flex items-center gap-2 mb-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs font-semibold">
              <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-md flex items-center gap-1">
                <MapPin size={12} className="text-green-600" /> {route.startPoint}
              </span>
              <ArrowRight size={14} className="text-gray-400" />
              <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-md flex items-center gap-1">
                <MapPin size={12} className="text-red-600" /> {route.destination}
              </span>
            </div>

            {/* Stops list */}
            {route.stops && route.stops.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[11px] font-bold uppercase text-gray-400 mb-2">Available Stops:</p>
                <div className="flex flex-wrap gap-1.5">
                  {route.stops.map((stop, i) => {
                    const isMatched =
                      (fromLocation && stop.toLowerCase().includes(fromLocation.toLowerCase())) ||
                      (toLocation && stop.toLowerCase().includes(toLocation.toLowerCase()));

                    return (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 ${
                          isMatched
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isMatched ? 'bg-white' : 'bg-indigo-400'}`}></span>
                        {stop}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-between text-[11px] text-gray-400 font-medium">
              <span>Distance: {route.distance || '15'} km</span>
              <span className="text-green-600 font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> Active Schedule
              </span>
            </div>
          </div>
        ))}

        {filteredRoutes.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-100">
            <Bus size={44} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-700">No Bus Route for this Selection</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              No direct bus found between <strong className="text-gray-700">{fromLocation || 'selected starting point'}</strong> and <strong className="text-gray-700">{toLocation || 'selected destination'}</strong>.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              Show All Bus Schedules
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
