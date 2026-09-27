import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import {
  Clock,
  MapPin,
  ArrowRight,
  Search,
  RefreshCw,
  Bus,
  ArrowLeftRight,
  CheckCircle2,
  X,
  Crosshair,
  ListFilter
} from 'lucide-react';

export default function Schedules() {
  const [routes, setRoutes] = useState([]);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromSuggestionsOpen, setFromSuggestionsOpen] = useState(false);
  const [toSuggestionsOpen, setToSuggestionsOpen] = useState(false);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [gpsLoading, setGpsLoading] = useState(false);

  const defaultDemoRoutes = [
    { _id: '1', routeName: 'City Center to Main Campus', routeNumber: 'R1', startPoint: 'City Center', destination: 'Main Campus', stops: ['Pollachi', 'Kovilpalayam', 'Kinathukadavu', 'Udumalpet'], distance: 15, estimatedDuration: 45, timing: '07:30 AM & 08:15 AM' },
    { _id: '2', routeName: 'Central Bus Station to Main Campus', routeNumber: 'R2', startPoint: 'Central Bus Station', destination: 'Main Campus', stops: ['Town Hall', 'Railway Station', 'Tech Park', 'Gandhipuram'], distance: 12, estimatedDuration: 35, timing: '07:45 AM & 08:30 AM' },
    { _id: '3', routeName: 'Railway Station to Main Campus', routeNumber: 'R3', startPoint: 'Railway Station', destination: 'Main Campus', stops: ['Gandhi Statue', 'Collectorate', 'Airport Road', 'Singanallur', 'Ukkadam'], distance: 18, estimatedDuration: 50, timing: '07:15 AM & 08:00 AM' },
    { _id: '4', routeName: 'Saravanampatti to Main Campus', routeNumber: 'R4', startPoint: 'Saravanampatti', destination: 'Main Campus', stops: ['CHIL SEZ', 'Kalapatti', 'Peelamedu', 'Hope College'], distance: 22, estimatedDuration: 55, timing: '07:10 AM & 08:00 AM' },
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

  // Extract all distinct locations
  const allLocations = Array.from(
    new Set(
      routes.flatMap(r => [r.startPoint, r.destination, ...(r.stops || [])]).filter(Boolean)
    )
  ).sort();

  // Instant filter whenever From or To changes
  useEffect(() => {
    const qFrom = fromLocation.trim().toLowerCase();
    const qTo = toLocation.trim().toLowerCase();

    const results = routes.filter(route => {
      const routeLocations = [
        route.startPoint,
        route.destination,
        route.routeName,
        ...(route.stops || [])
      ].map(l => l?.toLowerCase().trim() || '');

      const matchFrom = !qFrom || routeLocations.some(loc => loc.includes(qFrom));
      const matchTo = !qTo || routeLocations.some(loc => loc.includes(qTo));

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

  // HTML5 GPS Geolocation
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        // Set nearest campus stop or friendly label
        setFromLocation('Current GPS Location');
      },
      (error) => {
        setGpsLoading(false);
        alert('Could not access GPS location. Please allow location permissions.');
      },
      { timeout: 8000 }
    );
  };

  // Filter suggestion list based on what user is typing
  const fromSuggestions = allLocations.filter(loc =>
    !fromLocation || loc.toLowerCase().includes(fromLocation.toLowerCase())
  );

  const toSuggestions = allLocations.filter(loc =>
    !toLocation || loc.toLowerCase().includes(toLocation.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="text-indigo-600" size={28} /> Bus Schedules & Custom Location Finder
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Type or select ANY location you want to search available bus routes
          </p>
        </div>
        {(fromLocation || toLocation) && (
          <button
            onClick={handleReset}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 font-bold"
          >
            <RefreshCw size={13} /> Reset All
          </button>
        )}
      </div>

      {/* Interactive Location Selector Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">

          {/* FROM Location Input with Autocomplete & Custom Typing */}
          <div className="md:col-span-5 relative">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                From (Any Starting Point):
              </label>
              <button
                type="button"
                onClick={handleUseGPS}
                disabled={gpsLoading}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold hover:underline"
              >
                <Crosshair size={12} /> {gpsLoading ? 'Detecting GPS...' : 'Use My GPS'}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Type or select any location (e.g. Pollachi, City Center...)"
                value={fromLocation}
                onChange={(e) => {
                  setFromLocation(e.target.value);
                  setFromSuggestionsOpen(true);
                }}
                onFocus={() => setFromSuggestionsOpen(true)}
                className="w-full p-3.5 pl-10 pr-16 border-2 border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 font-semibold text-sm focus:border-green-500 focus:bg-white focus:outline-none transition shadow-inner"
              />
              <MapPin size={18} className="absolute left-3.5 top-3.5 text-green-600" />

              <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
                {fromLocation && (
                  <button
                    type="button"
                    onClick={() => setFromLocation('')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFromSuggestionsOpen(!fromSuggestionsOpen)}
                  className="p-1 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-indigo-50"
                  title="Show all locations"
                >
                  <ListFilter size={16} />
                </button>
              </div>
            </div>

            {/* Suggestions Dropdown for FROM */}
            {fromSuggestionsOpen && fromSuggestions.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setFromSuggestionsOpen(false)}
                />
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-56 overflow-y-auto divide-y divide-gray-50">
                  <div className="p-2 bg-gray-50 text-[11px] font-bold text-gray-400 uppercase">
                    Select from available locations:
                  </div>
                  {fromSuggestions.map((loc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setFromLocation(loc);
                        setFromSuggestionsOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 font-medium flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin size={13} className="text-gray-400" /> {loc}
                      </span>
                      {fromLocation === loc && (
                        <CheckCircle2 size={14} className="text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* SWAP BUTTON */}
          <div className="md:col-span-1 flex justify-center items-center pt-2 md:pt-6">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap From and To"
              className="p-3 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition shadow-sm hover:scale-110 active:scale-95"
            >
              <ArrowLeftRight size={18} />
            </button>
          </div>

          {/* TO Location Input with Autocomplete & Custom Typing */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
              To (Any Destination):
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="Type or select any destination (e.g. Main Campus...)"
                value={toLocation}
                onChange={(e) => {
                  setToLocation(e.target.value);
                  setToSuggestionsOpen(true);
                }}
                onFocus={() => setToSuggestionsOpen(true)}
                className="w-full p-3.5 pl-10 pr-16 border-2 border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 font-semibold text-sm focus:border-red-500 focus:bg-white focus:outline-none transition shadow-inner"
              />
              <MapPin size={18} className="absolute left-3.5 top-3.5 text-red-600" />

              <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
                {toLocation && (
                  <button
                    type="button"
                    onClick={() => setToLocation('')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setToSuggestionsOpen(!toSuggestionsOpen)}
                  className="p-1 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-indigo-50"
                  title="Show all locations"
                >
                  <ListFilter size={16} />
                </button>
              </div>
            </div>

            {/* Suggestions Dropdown for TO */}
            {toSuggestionsOpen && toSuggestions.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setToSuggestionsOpen(false)}
                />
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-56 overflow-y-auto divide-y divide-gray-50">
                  <div className="p-2 bg-gray-50 text-[11px] font-bold text-gray-400 uppercase">
                    Select from available destinations:
                  </div>
                  {toSuggestions.map((loc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setToLocation(loc);
                        setToSuggestionsOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 font-medium flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin size={13} className="text-gray-400" /> {loc}
                      </span>
                      {toLocation === loc && (
                        <CheckCircle2 size={14} className="text-red-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>

        {/* Quick Location Pills (Tap to fill either From or To) */}
        <div className="mt-5 pt-3.5 border-t border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Popular Locations (Tap to select instantly):
            </p>
            <span className="text-[11px] text-gray-400">
              You can also type any custom location above
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allLocations.map((loc, idx) => {
              const isFrom = fromLocation.toLowerCase() === loc.toLowerCase();
              const isTo = toLocation.toLowerCase() === loc.toLowerCase();

              let pillStyle = "bg-gray-100 text-gray-700 hover:bg-gray-200";
              if (isFrom) pillStyle = "bg-green-600 text-white font-bold shadow-sm";
              if (isTo) pillStyle = "bg-red-600 text-white font-bold shadow-sm";

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (!fromLocation) {
                      setFromLocation(loc);
                    } else if (!toLocation && toLocation !== loc) {
                      setToLocation(loc);
                    } else {
                      setFromLocation(loc);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 font-medium ${pillStyle}`}
                >
                  <MapPin size={12} /> {loc}
                  {isFrom && <span className="text-[10px] ml-0.5">(From)</span>}
                  {isTo && <span className="text-[10px] ml-0.5">(To)</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Status Banner */}
        {(fromLocation || toLocation) && (
          <div className="mt-4 bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-indigo-950 font-semibold gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Searching routes for:</span>
              {fromLocation && (
                <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-md font-bold">
                  From: {fromLocation}
                </span>
              )}
              {fromLocation && toLocation && <span>➔</span>}
              {toLocation && (
                <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-md font-bold">
                  To: {toLocation}
                </span>
              )}
            </div>
            <span className="text-indigo-600 font-bold bg-white px-2.5 py-1 rounded-md border border-indigo-100">
              {filteredRoutes.length} matching route(s) found
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
                <Bus size={13} className="text-amber-600" /> Departure Timings: {route.timing}
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

            {/* Stops list with highlight for searched locations */}
            {route.stops && route.stops.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[11px] font-bold uppercase text-gray-400 mb-2">Intermediate Stops:</p>
                <div className="flex flex-wrap gap-1.5">
                  {route.stops.map((stop, i) => {
                    const isMatched =
                      (fromLocation && stop.toLowerCase().includes(fromLocation.toLowerCase().trim())) ||
                      (toLocation && stop.toLowerCase().includes(toLocation.toLowerCase().trim()));

                    return (
                      <span
                        key={i}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition ${
                          isMatched
                            ? 'bg-indigo-600 text-white font-bold shadow-sm'
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
            <h3 className="text-base font-bold text-gray-700">No Bus Route Found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              No direct bus matches <strong className="text-gray-700 font-bold">"{fromLocation}"</strong> ➔ <strong className="text-gray-700 font-bold">"{toLocation}"</strong>. You can clear the search or request a new route from the Admin.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
            >
              Clear & View All Routes
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
