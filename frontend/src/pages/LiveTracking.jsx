import { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';
import api from '../services/api';
import {
  Route as RouteIcon,
  MapPin,
  Clock,
  Bus as BusIcon,
  Navigation,
  Crosshair,
  Gauge,
  Phone,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle,
  Eye,
  Radio,
  LocateFixed
} from 'lucide-react';

// Animated Glowing Bus Marker using DivIcon (100% reliable, no broken CDN/image issues)
const busDivIcon = L.divIcon({
  className: 'custom-bus-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
      <div style="position: absolute; width: 44px; height: 44px; background: rgba(79, 70, 229, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 34px; height: 34px; background: linear-gradient(135deg, #4f46e5, #4338ca); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 14px rgba(0,0,0,0.35); border: 2.5px solid #ffffff; font-size: 16px;">
        🚌
      </div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -24]
});

// Animated Selected Location Pin Marker
const userPinIcon = (label = 'Selected Location') => L.divIcon({
  className: 'custom-user-pin',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div style="position: absolute; width: 40px; height: 40px; background: rgba(239, 68, 68, 0.35); border-radius: 50%; animation: ping 2s infinite;"></div>
      <div style="position: relative; width: 32px; height: 32px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.5); border: 2.5px solid #ffffff; font-size: 16px; font-weight: bold;">
        📍
      </div>
      <div style="margin-top: 2px; background: #111827; color: #ffffff; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.25);">
        ${label}
      </div>
    </div>
  `,
  iconSize: [80, 50],
  iconAnchor: [40, 32],
  popupAnchor: [0, -32]
});

// Stop Waypoint Icon
const stopWaypointIcon = (number, name) => L.divIcon({
  className: 'custom-stop-marker',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="width: 22px; height: 22px; background: #ffffff; border: 3px solid #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #4338ca; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
        ${number}
      </div>
      <div style="margin-top: 1px; background: rgba(255,255,255,0.95); color: #374151; padding: 1px 5px; border-radius: 4px; font-size: 9px; font-weight: 700; white-space: nowrap; border: 1px solid #e5e7eb; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
        ${name}
      </div>
    </div>
  `,
  iconSize: [60, 40],
  iconAnchor: [30, 11],
  popupAnchor: [0, -15]
});

// Component to handle map clicks for selecting any location
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    }
  });
  return null;
}

// Controller to smoothly pan/zoom map
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function LiveTracking() {
  const [buses, setBuses] = useState({});
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState('ALL');
  const [selectedMapPoint, setSelectedMapPoint] = useState(null);
  const [mapCenter, setMapCenter] = useState([10.8200, 77.0100]);
  const [mapZoom, setMapZoom] = useState(11);
  const [selectionMode, setSelectionMode] = useState('PICKUP'); // 'PICKUP' or 'DESTINATION'
  const [pointDetails, setPointDetails] = useState(null);

  // Predefined realistic route waypoints with stop details
  const routeWaypoints = {
    '1': [
      { lat: 10.6558, lng: 77.0090, name: 'City Center (Pollachi)' },
      { lat: 10.7200, lng: 77.0150, name: 'Kovilpalayam Junction' },
      { lat: 10.8200, lng: 77.0300, name: 'Kinathukadavu Bus Stop' },
      { lat: 10.9200, lng: 77.0450, name: 'Eachanari Temple' },
      { lat: 10.9700, lng: 77.0200, name: 'Sundarapuram' },
      { lat: 11.0168, lng: 76.9558, name: 'College Main Campus Gate' },
    ],
    '2': [
      { lat: 11.0020, lng: 76.9600, name: 'Central Bus Station' },
      { lat: 10.9900, lng: 76.9700, name: 'Town Hall' },
      { lat: 10.9980, lng: 76.9850, name: 'Coimbatore Railway Station' },
      { lat: 11.0250, lng: 77.0050, name: 'Tech Park / TIDEL' },
      { lat: 11.0168, lng: 76.9558, name: 'College Main Campus Gate' },
    ],
    '3': [
      { lat: 11.0100, lng: 76.9700, name: 'Railway Station East' },
      { lat: 11.0200, lng: 76.9850, name: 'Gandhi Statue Circle' },
      { lat: 11.0350, lng: 77.0150, name: 'District Collectorate' },
      { lat: 11.0400, lng: 77.0350, name: 'Airport Road Junction' },
      { lat: 11.0168, lng: 76.9558, name: 'College Main Campus Gate' },
    ]
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data } = await api.get('/routes');
        if (data && data.length > 0) setRoutes(data);
        else {
          setRoutes([
            { _id: '1', routeName: 'City Center to Main Campus', routeNumber: 'R1', startPoint: 'City Center', destination: 'Main Campus', stops: ['Pollachi', 'Kovilpalayam', 'Kinathukadavu', 'Eachanari', 'Sundarapuram'], distance: 18, estimatedDuration: 45 },
            { _id: '2', routeName: 'Central Bus Station to Main Campus', routeNumber: 'R2', startPoint: 'Central Bus Station', destination: 'Main Campus', stops: ['Town Hall', 'Railway Station', 'Tech Park'], distance: 12, estimatedDuration: 35 },
            { _id: '3', routeName: 'Railway Station to Main Campus', routeNumber: 'R3', startPoint: 'Railway Station', destination: 'Main Campus', stops: ['Gandhi Statue', 'Collectorate', 'Airport Road'], distance: 16, estimatedDuration: 40 },
          ]);
        }
      } catch (err) {
        setRoutes([
          { _id: '1', routeName: 'City Center to Main Campus', routeNumber: 'R1', startPoint: 'City Center', destination: 'Main Campus', stops: ['Pollachi', 'Kovilpalayam', 'Kinathukadavu', 'Eachanari', 'Sundarapuram'], distance: 18, estimatedDuration: 45 },
          { _id: '2', routeName: 'Central Bus Station to Main Campus', routeNumber: 'R2', startPoint: 'Central Bus Station', destination: 'Main Campus', stops: ['Town Hall', 'Railway Station', 'Tech Park'], distance: 12, estimatedDuration: 35 },
          { _id: '3', routeName: 'Railway Station to Main Campus', routeNumber: 'R3', startPoint: 'Railway Station', destination: 'Main Campus', stops: ['Gandhi Statue', 'Collectorate', 'Airport Road'], distance: 16, estimatedDuration: 40 },
        ]);
      }
    };
    fetchRoutes();

    let socket;
    try {
      socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
        transports: ['websocket', 'polling']
      });

      socket.on('busLocationUpdate', (data) => {
        setBuses((prevBuses) => ({
          ...prevBuses,
          [data.busId]: data
        }));
      });
    } catch (e) {
      console.warn('Socket connection error:', e);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // When user clicks anywhere on the map
  const handleMapClick = (lat, lng) => {
    setSelectedMapPoint({ lat, lng });

    // Calculate approximate distance to nearest bus & campus
    const campusLat = 11.0168;
    const campusLng = 76.9558;
    const distToCampus = (Math.sqrt(Math.pow(lat - campusLat, 2) + Math.pow(lng - campusLng, 2)) * 111).toFixed(1);
    const estTimeMins = Math.round((distToCampus / 35) * 60) || 12;

    setPointDetails({
      lat: lat.toFixed(4),
      lng: lng.toFixed(4),
      distToCampus,
      estTimeMins,
      mode: selectionMode
    });
  };

  const handleSelectStop = (stop) => {
    setSelectedMapPoint({ lat: stop.lat, lng: stop.lng });
    setMapCenter([stop.lat, stop.lng]);
    setMapZoom(14);
    setPointDetails({
      name: stop.name,
      lat: stop.lat.toFixed(4),
      lng: stop.lng.toFixed(4),
      distToCampus: 'On Scheduled Route',
      estTimeMins: 15,
      mode: 'STOP'
    });
  };

  const selectedRouteObj = routes.find(r => r._id === selectedRouteId || r.routeNumber === selectedRouteId);
  const activeWaypoints = selectedRouteId !== 'ALL'
    ? routeWaypoints[selectedRouteObj?._id || '1'] || routeWaypoints['1']
    : routeWaypoints['1'];

  const busList = Object.values(buses);
  const currentBus = busList[0] || {
    busId: 'bus-1',
    routeName: 'City Center to Campus',
    speed: 46,
    status: 'ON TIME',
    lat: 10.8200,
    lng: 77.0300
  };

  return (
    <DashboardLayout>
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Navigation className="text-indigo-600 animate-bounce" size={26} />
              Interactive Smart Bus Live Tracker
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 shadow-sm border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              Live GPS Active
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            👉 <strong className="text-indigo-700">Click anywhere on the map</strong> to pick any custom location & see bus ETA!
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Selective Route Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
            <RouteIcon size={16} className="text-indigo-600 ml-1.5" />
            <select
              value={selectedRouteId}
              onChange={(e) => {
                setSelectedRouteId(e.target.value);
                const wp = routeWaypoints[e.target.value] || routeWaypoints['1'];
                if (wp && wp[0]) {
                  setMapCenter([wp[0].lat, wp[0].lng]);
                  setMapZoom(12);
                }
              }}
              className="p-1.5 pr-6 border-0 bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">📍 All Routes (Global Map)</option>
              {routes.map(r => (
                <option key={r._id} value={r._id}>
                  Route #{r.routeNumber}: {r.routeName}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Center on Bus */}
          <button
            onClick={() => {
              if (currentBus.lat) {
                setMapCenter([currentBus.lat, currentBus.lng]);
                setMapZoom(14);
              }
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-indigo-200"
          >
            <LocateFixed size={15} /> Find Bus
          </button>
        </div>
      </div>

      {/* Floating High-Tech Transportation Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Active Bus</p>
            <p className="text-lg font-black">{currentBus.busId ? 'TN-43-1234' : 'Bus 101'}</p>
            <p className="text-[11px] text-green-400 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span> Moving Live
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
            🚌
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Speed</p>
            <p className="text-xl font-black text-gray-900">{currentBus.speed || 48} <span className="text-xs font-normal text-gray-500">km/h</span></p>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">🟢 Highway Pace</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Gauge size={20} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Next Scheduled Stop</p>
            <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">Kinathukadavu</p>
            <p className="text-[11px] text-amber-600 font-bold mt-0.5">ETA: ~6 Mins</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Map Click Selection</p>
            <p className="text-sm font-bold text-gray-900">
              {selectedMapPoint ? '📍 Point Picked' : '👆 Tap on Map'}
            </p>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">
              {selectedMapPoint ? `${pointDetails?.distToCampus} km away` : 'Click to drop pin'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Crosshair size={20} />
          </div>
        </div>
      </div>

      {/* Main Interactive Leaflet Map View */}
      <div className="relative bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden h-[620px] w-full">
        {/* Floating Instruction Tooltip */}
        <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-gray-200/80 flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600" />
          <span className="text-xs font-bold text-gray-800">
            {selectedMapPoint ? 'Location Selected! Click elsewhere to change.' : 'Touch or Click anywhere on Map to pick location!'}
          </span>
        </div>

        {/* Selected Location Card Popover (if user clicked on the map) */}
        {pointDetails && (
          <div className="absolute top-16 left-4 z-[400] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-indigo-200 max-w-xs w-full animate-fadeIn">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                📍 {pointDetails.name || 'Custom Map Location'}
              </span>
              <button
                onClick={() => {
                  setSelectedMapPoint(null);
                  setPointDetails(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600 font-medium">
              Coordinates: <span className="font-mono font-bold text-gray-900">{pointDetails.lat}, {pointDetails.lng}</span>
            </p>
            <div className="mt-2.5 p-2 bg-indigo-50 rounded-xl text-xs text-indigo-950 flex justify-between items-center font-bold">
              <span>Distance to Campus:</span>
              <span className="text-indigo-700">{pointDetails.distToCampus} km</span>
            </div>
            <div className="mt-1.5 p-2 bg-green-50 rounded-xl text-xs text-green-950 flex justify-between items-center font-bold">
              <span>Est. Bus Arrival Time:</span>
              <span className="text-green-700 font-extrabold">~{pointDetails.estTimeMins} mins</span>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2 italic">
              ✅ Bus will pick you up near this checkpoint
            </p>
          </div>
        )}

        {/* Leaflet Map */}
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          <MapClickHandler onLocationSelect={handleMapClick} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Polyline Route Track */}
          {activeWaypoints && activeWaypoints.length > 0 && (
            <Polyline
              positions={activeWaypoints.map(w => [w.lat, w.lng])}
              color="#4f46e5"
              weight={6}
              opacity={0.8}
              dashArray="6, 8"
            />
          )}

          {/* Intermediate Stops Markers */}
          {activeWaypoints && activeWaypoints.map((stop, index) => (
            <Marker
              key={index}
              position={[stop.lat, stop.lng]}
              icon={stopWaypointIcon(index + 1, stop.name)}
              eventHandlers={{
                click: () => handleSelectStop(stop)
              }}
            >
              <Popup>
                <div className="text-xs p-1 font-sans">
                  <p className="font-bold text-indigo-700 text-sm">{stop.name}</p>
                  <p className="text-gray-500 mt-1">Stop #{index + 1} on Scheduled Route</p>
                  <button
                    onClick={() => handleSelectStop(stop)}
                    className="mt-2 w-full bg-indigo-600 text-white px-2 py-1 rounded text-xs font-bold"
                  >
                    Select this Stop
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* User Clicked Custom Location Pin */}
          {selectedMapPoint && (
            <Marker
              position={[selectedMapPoint.lat, selectedMapPoint.lng]}
              icon={userPinIcon(pointDetails?.name || 'Selected Pick Point')}
            >
              <Popup>
                <div className="text-xs p-1 font-sans">
                  <p className="font-bold text-red-600 text-sm">📍 Your Selected Checkpoint</p>
                  <p className="text-gray-600 mt-1">Lat: {selectedMapPoint.lat.toFixed(4)}, Lng: {selectedMapPoint.lng.toFixed(4)}</p>
                  <p className="text-indigo-700 font-bold mt-1">ETA: ~{pointDetails?.estTimeMins || 15} Mins</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Live Moving Bus Marker */}
          {busList.map(bus => (
            <Marker
              key={bus.busId}
              position={[bus.lat || 10.8200, bus.lng || 77.0300]}
              icon={busDivIcon}
            >
              <Popup>
                <div className="p-2 font-sans text-xs min-w-[180px]">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-indigo-700 mb-1">
                    <BusIcon size={16} /> {bus.routeName || 'College Bus 101'}
                  </div>
                  <div className="space-y-1 text-gray-600">
                    <p><strong>Plate:</strong> TN-43-A-1234</p>
                    <p><strong>Speed:</strong> <span className="text-indigo-600 font-bold">{bus.speed || 45} km/h</span></p>
                    <p><strong>Status:</strong> <span className="text-green-600 font-bold">{bus.status || 'ON TIME'}</span></p>
                    <p><strong>Capacity:</strong> 50 Seats (14 Available)</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Quick Route Stops Bar at Bottom of Map */}
        <div className="absolute bottom-4 left-4 right-4 z-[400] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-200/90 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
              <RouteIcon size={14} className="text-indigo-600" /> Route Stops:
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {activeWaypoints.map((stop, i) => (
              <button
                key={i}
                onClick={() => handleSelectStop(stop)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 border ${
                  selectedMapPoint?.lat === stop.lat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-gray-50 hover:bg-indigo-50 text-gray-700 border-gray-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                {stop.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
