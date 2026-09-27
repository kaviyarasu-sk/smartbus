import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import {
  Clock, MapPin, ArrowRight, RefreshCw, Bus, ArrowLeftRight,
  CheckCircle2, X, Crosshair, School, Navigation, Loader2,
  ChevronDown, Star
} from 'lucide-react';

// All hardcoded locations covering Tamil Nadu + Campus
const COLLEGE_DESTINATION = 'College Main Campus Gate';

const ALL_STOPS_MASTER = [
  // Route R1 - Pollachi
  'Pollachi City Center', 'Pollachi Bus Stand', 'Kovilpalayam Junction', 'Kinathukadavu', 'Eachanari', 'Sundarapuram', 'Ganapathy',
  // Route R2 - Coimbatore
  'Coimbatore Central Bus Station', 'Gandhipuram', 'Town Hall', 'Coimbatore Railway Station', 'Ukkadam', 'Peelamedu', 'Avinashi Road',
  // Route R3 - Tirupur
  'Tirupur Bus Stand', 'Tirupur Town', 'Avinashi', 'Annur', 'Sulur', 'Nava India', 'Saravanampatti',
  // Route R4 - Palakkad
  'Palakkad Bus Stand', 'Palakkad Town', 'Walayar', 'Kanjikode', 'Vadakkencherry', 'Chittur', 'Ottapalam', 'Coimbatore',
  // Route R5 - Erode
  'Erode Bus Stand', 'Erode Town', 'Perundurai', 'Ingur', 'Bhavani', 'Mettupalayam Road', 'Kalapatti',
  // Route R6 - Mettupalayam
  'Mettupalayam Bus Stand', 'Mettupalayam Town', 'Karamadai', 'Thadagam', 'Perur', 'Singanallur', 'CHIL IT Park',
  // Route R7 - Udumalpet
  'Udumalpet Bus Stand', 'Udumalpet Town', 'Dharapuram', 'Kangeyam', 'Palladam', 'Tirupur South',
  // Route R8 - Saravanampatti
  'Saravanampatti Bus Stop', 'CHIL SEZ', 'Kalapatti Cross', 'Hope College', 'Ondipudur',
  // Final destination
  'College Main Campus Gate'
].sort((a, b) => a.localeCompare(b));

export default function Schedules() {
  const [routes, setRoutes] = useState([]);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState(COLLEGE_DESTINATION);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [fromSearch, setFromSearch] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/routes');
      if (data && data.length > 0) {
        setRoutes(data);
        setFilteredRoutes(data);
      } else {
        setFallbackRoutes();
      }
    } catch (err) {
      setFallbackRoutes();
    }
    setLoading(false);
  };

  const setFallbackRoutes = () => {
    const fallback = [
      { _id: '1', routeName: 'Pollachi City Center to College Campus', routeNumber: 'R1', startPoint: 'Pollachi City Center', destination: 'College Main Campus Gate', stops: ['Pollachi Bus Stand', 'Kovilpalayam Junction', 'Kinathukadavu', 'Eachanari', 'Sundarapuram', 'Ganapathy', 'College Main Campus Gate'], distance: 48, estimatedDuration: 75, timing: '07:00 AM & 07:45 AM' },
      { _id: '2', routeName: 'Coimbatore Central to College Campus', routeNumber: 'R2', startPoint: 'Coimbatore Central Bus Station', destination: 'College Main Campus Gate', stops: ['Gandhipuram', 'Town Hall', 'Coimbatore Railway Station', 'Ukkadam', 'Peelamedu', 'Avinashi Road', 'College Main Campus Gate'], distance: 22, estimatedDuration: 40, timing: '07:30 AM & 08:15 AM' },
      { _id: '3', routeName: 'Tirupur to College Campus', routeNumber: 'R3', startPoint: 'Tirupur Bus Stand', destination: 'College Main Campus Gate', stops: ['Tirupur Town', 'Avinashi', 'Annur', 'Sulur', 'Nava India', 'Saravanampatti', 'College Main Campus Gate'], distance: 55, estimatedDuration: 90, timing: '06:30 AM & 07:15 AM' },
      { _id: '4', routeName: 'Palakkad to College Campus', routeNumber: 'R4', startPoint: 'Palakkad Bus Stand', destination: 'College Main Campus Gate', stops: ['Palakkad Town', 'Walayar', 'Kanjikode', 'Chittur', 'Coimbatore', 'College Main Campus Gate'], distance: 80, estimatedDuration: 120, timing: '06:00 AM & 06:45 AM' },
      { _id: '5', routeName: 'Erode to College Campus', routeNumber: 'R5', startPoint: 'Erode Bus Stand', destination: 'College Main Campus Gate', stops: ['Erode Town', 'Perundurai', 'Bhavani', 'Mettupalayam Road', 'Kalapatti', 'College Main Campus Gate'], distance: 70, estimatedDuration: 100, timing: '06:15 AM & 07:00 AM' },
      { _id: '6', routeName: 'Mettupalayam to College Campus', routeNumber: 'R6', startPoint: 'Mettupalayam Bus Stand', destination: 'College Main Campus Gate', stops: ['Mettupalayam Town', 'Karamadai', 'Thadagam', 'Perur', 'Singanallur', 'CHIL IT Park', 'College Main Campus Gate'], distance: 38, estimatedDuration: 60, timing: '07:15 AM & 08:00 AM' },
      { _id: '7', routeName: 'Udumalpet to College Campus', routeNumber: 'R7', startPoint: 'Udumalpet Bus Stand', destination: 'College Main Campus Gate', stops: ['Udumalpet Town', 'Dharapuram', 'Kangeyam', 'Palladam', 'Tirupur South', 'Kinathukadavu', 'College Main Campus Gate'], distance: 90, estimatedDuration: 130, timing: '05:30 AM & 06:15 AM' },
      { _id: '8', routeName: 'Saravanampatti to College Campus', routeNumber: 'R8', startPoint: 'Saravanampatti Bus Stop', destination: 'College Main Campus Gate', stops: ['CHIL SEZ', 'Kalapatti Cross', 'Peelamedu', 'Hope College', 'Singanallur', 'Ondipudur', 'College Main Campus Gate'], distance: 15, estimatedDuration: 30, timing: '08:00 AM & 08:30 AM' },
    ];
    setRoutes(fallback);
    setFilteredRoutes(fallback);
  };

  // All unique stop locations across all routes
  const allStopsFromRoutes = Array.from(
    new Set([
      ...ALL_STOPS_MASTER,
      ...routes.flatMap(r => [r.startPoint, ...(r.stops || [])]).filter(Boolean)
    ])
  ).filter(s => s !== COLLEGE_DESTINATION).sort((a, b) => a.localeCompare(b));

  // Filtered suggestions for search
  const filteredSuggestions = allStopsFromRoutes.filter(loc =>
    !fromSearch || loc.toLowerCase().includes(fromSearch.toLowerCase())
  );

  // Auto-filter routes when from/to changes
  useEffect(() => {
    if (!fromLocation) {
      setFilteredRoutes(routes);
      return;
    }

    const qFrom = fromLocation.trim().toLowerCase();
    const results = routes.filter(route => {
      const allRouteLocations = [
        route.startPoint,
        route.routeName,
        ...(route.stops || [])
      ].map(l => l?.toLowerCase() || '');
      return allRouteLocations.some(loc => loc.includes(qFrom));
    });
    setFilteredRoutes(results);
  }, [fromLocation, routes]);

  // GPS: Detect Current Location
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('GPS not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Reverse geocode using OpenStreetMap Nominatim (free)
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const area = data.address?.suburb || data.address?.town || data.address?.city || data.address?.village || 'Current Location';
          setFromLocation(area);
          setFromSearch(area);
        } catch {
          setFromLocation('Current GPS Location');
          setFromSearch('Current GPS Location');
        }
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
        alert('Could not access GPS. Please allow location permission and try again.');
      },
      { timeout: 10000 }
    );
  };

  // Set College as destination
  const handleGoToCollege = () => {
    setToLocation(COLLEGE_DESTINATION);
  };

  const handleReset = () => {
    setFromLocation('');
    setFromSearch('');
    setToLocation(COLLEGE_DESTINATION);
    setFilteredRoutes(routes);
    setShowFromDropdown(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Clock className="text-indigo-600" size={27} />
            Bus Schedule Finder
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Select your pickup location → College will be set automatically as destination
          </p>
        </div>
        <button onClick={handleReset} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 font-semibold">
          <RefreshCw size={13} /> Reset
        </button>
      </div>

      {/* Main Location Picker Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">

        {/* FROM: Your Location */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
              Your Pickup Location (Select Any Stop or Use GPS)
            </label>
            <button
              type="button"
              onClick={handleUseGPS}
              disabled={gpsLoading}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition disabled:opacity-50"
            >
              {gpsLoading
                ? <><Loader2 size={13} className="animate-spin" /> Detecting GPS...</>
                : <><Crosshair size={13} /> Use My GPS Location</>
              }
            </button>
          </div>

          {/* From Input with Full Dropdown */}
          <div className="relative">
            <div
              className={`flex items-center gap-2 w-full p-3.5 border-2 rounded-xl cursor-pointer transition ${showFromDropdown ? 'border-indigo-500 bg-white' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
              onClick={() => setShowFromDropdown(!showFromDropdown)}
            >
              <MapPin size={18} className="text-green-600 flex-shrink-0" />
              <span className={`flex-1 text-sm font-semibold ${fromLocation ? 'text-gray-900' : 'text-gray-400'}`}>
                {fromLocation || 'Select or search your starting location...'}
              </span>
              {fromLocation && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFromLocation('');
                    setFromSearch('');
                    setFilteredRoutes(routes);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
                >
                  <X size={15} />
                </button>
              )}
              <ChevronDown size={16} className={`text-gray-400 transition ${showFromDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* Big Scrollable Dropdown with Search */}
            {showFromDropdown && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowFromDropdown(false)} />
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-40 overflow-hidden">
                  {/* Search inside Dropdown */}
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <div className="relative">
                      <Navigation size={15} className="absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search your town, stop, or area name..."
                        value={fromSearch}
                        onChange={(e) => setFromSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-400 bg-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Location List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {/* GPS Option at Top */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowFromDropdown(false);
                        handleUseGPS();
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50 flex items-center gap-3 bg-indigo-50/50 transition"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Crosshair size={16} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-bold">Use My Current GPS Location</p>
                        <p className="text-xs text-indigo-400 font-normal">Automatically detect where you are right now</p>
                      </div>
                    </button>

                    {/* All Stops List */}
                    {filteredSuggestions.length === 0 && (
                      <div className="px-4 py-6 text-center text-sm text-gray-400">
                        No matching location found. Try a different name.
                      </div>
                    )}
                    {filteredSuggestions.map((loc, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setFromLocation(loc);
                          setFromSearch(loc);
                          setShowFromDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-indigo-50 flex items-center justify-between transition ${fromLocation === loc ? 'bg-indigo-50 text-indigo-800' : 'text-gray-800'}`}
                      >
                        <span className="flex items-center gap-3 font-medium">
                          <MapPin size={15} className={fromLocation === loc ? 'text-indigo-600' : 'text-gray-400'} />
                          {loc}
                        </span>
                        {fromLocation === loc && <CheckCircle2 size={16} className="text-indigo-600 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Swap & Arrow Visual */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 border-t border-dashed border-gray-200"></div>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold">
            <ArrowRight size={16} className="text-indigo-500" />
          </div>
          <div className="flex-1 border-t border-dashed border-gray-200"></div>
        </div>

        {/* TO: College Destination (always fixed) */}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            Destination (College)
          </label>
          <div className="flex items-center gap-3 p-3.5 border-2 border-red-200 rounded-xl bg-red-50/60">
            <School size={20} className="text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">{COLLEGE_DESTINATION}</p>
              <p className="text-[11px] text-red-500 font-medium mt-0.5">🎓 Your College Campus — Default Destination</p>
            </div>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-red-200">
              Fixed
            </span>
          </div>
        </div>

        {/* Active Filter Status */}
        {fromLocation && (
          <div className="mt-4 bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold flex-wrap">
              <span className="text-gray-500 text-xs">Showing buses from</span>
              <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                <MapPin size={12} /> {fromLocation}
              </span>
              <ArrowRight size={14} className="text-gray-400" />
              <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                <School size={12} /> {COLLEGE_DESTINATION}
              </span>
            </div>
            <span className="bg-white border border-indigo-200 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap">
              <Bus size={13} /> {filteredRoutes.length} route(s) found
            </span>
          </div>
        )}
      </div>

      {/* Quick Location Shortcut Pills */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
          🌟 Quick Select Popular Starting Points:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'Pollachi City Center', 'Coimbatore Central Bus Station', 'Tirupur Bus Stand',
            'Erode Bus Stand', 'Mettupalayam Bus Stand', 'Saravanampatti Bus Stop',
            'Udumalpet Bus Stand', 'Palakkad Bus Stand', 'Gandhipuram',
            'Coimbatore Railway Station', 'Peelamedu', 'Sulur'
          ].map((loc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setFromLocation(loc);
                setFromSearch(loc);
                setShowFromDropdown(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${
                fromLocation === loc
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <MapPin size={11} /> {loc}
              {fromLocation === loc && <CheckCircle2 size={11} />}
            </button>
          ))}
        </div>
      </div>

      {/* Route Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 size={36} className="animate-spin text-indigo-500 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium">Loading routes...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRoutes.map(route => (
            <div key={route._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg mb-2 inline-block">
                    Route #{route.routeNumber}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{route.routeName}</h3>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1 whitespace-nowrap">
                    <Clock size={12} /> {route.estimatedDuration} mins
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{route.distance} km</span>
                </div>
              </div>

              {/* Timing */}
              {route.timing && (
                <div className="mb-3 text-xs bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-100 flex items-center gap-1.5 font-semibold">
                  <Bus size={13} className="text-amber-600" /> Departure: {route.timing}
                </div>
              )}

              {/* From → To path */}
              <div className="flex items-center gap-2 mb-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs font-semibold overflow-hidden">
                <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                  <MapPin size={11} className="text-green-600" /> {route.startPoint}
                </span>
                <ArrowRight size={14} className="text-gray-400 flex-shrink-0" />
                <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                  <School size={11} className="text-red-600" /> {route.destination}
                </span>
              </div>

              {/* Stops with match highlighting */}
              {route.stops && route.stops.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[11px] font-bold uppercase text-gray-400 mb-2">
                    All Stops on this Route:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {route.stops.map((stop, i) => {
                      const isMatch = fromLocation && stop.toLowerCase().includes(fromLocation.toLowerCase().trim());
                      return (
                        <span
                          key={i}
                          onClick={() => { setFromLocation(stop); setFromSearch(stop); }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition ${
                            isMatch
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isMatch ? 'bg-white' : 'bg-indigo-400'}`}></span>
                          {stop}
                          {stop === COLLEGE_DESTINATION && <Star size={10} className="text-yellow-400 fill-yellow-400" />}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[11px] text-gray-400 font-medium">
                  {route.stops?.length || 0} stops
                </span>
                <span className="text-green-600 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 size={12} /> Active & Running
                </span>
              </div>
            </div>
          ))}

          {filteredRoutes.length === 0 && (
            <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-100">
              <Bus size={44} className="mx-auto text-gray-200 mb-3" />
              <h3 className="text-base font-bold text-gray-700">No Direct Bus Found</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                No route covers <strong>"{fromLocation}"</strong>. Try searching a nearby town or check spelling.
              </p>
              <button onClick={handleReset} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition">
                Show All Routes
              </button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
