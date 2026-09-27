import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';
import api from '../services/api';
import { Route as RouteIcon, MapPin, Clock, Bus as BusIcon, Navigation } from 'lucide-react';

// Fix Leaflet marker icons safely without static asset import issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3204/3204128.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

export default function LiveTracking() {
  const [buses, setBuses] = useState({});
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState('ALL');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data } = await api.get('/routes');
        setRoutes(data);
      } catch (err) {
        setRoutes([
          { _id: '1', routeName: 'City Center to Main Campus', routeNumber: 'R1', startPoint: 'City Center', destination: 'Main Campus', stops: ['Pollachi', 'Kovilpalayam', 'Kinathukadavu', 'Udumalpet'], distance: 15, estimatedDuration: 45 },
          { _id: '2', routeName: 'Central Bus Station to Main Campus', routeNumber: 'R2', startPoint: 'Central Bus Station', destination: 'Main Campus', stops: ['Town Hall', 'Railway Station', 'Tech Park'], distance: 12, estimatedDuration: 35 },
          { _id: '3', routeName: 'Railway Station to Main Campus', routeNumber: 'R3', startPoint: 'Railway Station', destination: 'Main Campus', stops: ['Gandhi Statue', 'Collectorate', 'Airport Road'], distance: 18, estimatedDuration: 50 },
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

  const routeWaypoints = {
    '1': [
      [10.6558, 77.0090],
      [10.7500, 77.0200],
      [10.8200, 77.0300],
      [10.9500, 77.0500],
      [11.0168, 76.9558],
    ],
    '2': [
      [11.0020, 76.9600],
      [10.9800, 76.9800],
      [11.0168, 76.9558],
    ],
    '3': [
      [11.0100, 76.9700],
      [11.0300, 77.0100],
      [11.0168, 76.9558],
    ]
  };

  const selectedRouteObj = routes.find(r => r._id === selectedRouteId || r.routeNumber === selectedRouteId);
  const busList = Object.values(buses);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <Navigation className="text-indigo-600" size={28} /> Live Bus Tracking
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Real-time GPS bus location and selective route tracker</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border shadow-sm w-full md:w-auto">
          <RouteIcon size={18} className="text-indigo-600 ml-1" />
          <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Selective Route:</span>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="p-1.5 border rounded-lg text-sm bg-gray-50 font-semibold text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full md:w-60"
          >
            <option value="ALL">📍 All Routes (Global View)</option>
            {routes.map(r => (
              <option key={r._id} value={r._id}>
                Route {r.routeNumber}: {r.routeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedRouteObj && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                Route #{selectedRouteObj.routeNumber}
              </span>
              <h3 className="font-bold text-gray-800 text-sm md:text-base">{selectedRouteObj.routeName}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mt-1 font-medium">
              <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                <MapPin size={10} /> {selectedRouteObj.startPoint}
              </span>
              <span>➔</span>
              <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                <MapPin size={10} /> {selectedRouteObj.destination}
              </span>
              <span className="ml-2 text-indigo-700 flex items-center gap-1">
                <Clock size={12} /> {selectedRouteObj.estimatedDuration || 45} mins
              </span>
            </div>
          </div>

          {selectedRouteObj.stops && selectedRouteObj.stops.length > 0 && (
            <div className="text-xs text-gray-600 flex flex-wrap items-center gap-1">
              <span className="font-bold text-gray-400 uppercase text-[10px]">Stops:</span>
              {selectedRouteObj.stops.map((stop, i) => (
                <span key={i} className="bg-white border text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium">
                  {stop}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 h-[600px] w-full relative">
        <MapContainer
          center={[10.8500, 77.0100]}
          zoom={11}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {selectedRouteObj && routeWaypoints[selectedRouteObj._id || '1'] && (
            <Polyline
              positions={routeWaypoints[selectedRouteObj._id || '1']}
              color="#4f46e5"
              weight={5}
              opacity={0.7}
              dashArray="8, 8"
            />
          )}

          {busList.map(bus => (
            <Marker key={bus.busId} position={[bus.lat, bus.lng]} icon={busIcon}>
              <Popup>
                <div className="font-sans text-xs">
                  <div className="font-bold text-sm text-indigo-700 mb-1 flex items-center gap-1">
                    <BusIcon size={14} /> {bus.routeName || 'College Bus'}
                  </div>
                  <p className="text-gray-600"><strong>Bus ID:</strong> {bus.busId}</p>
                  <p className="text-gray-600"><strong>Current Speed:</strong> {bus.speed} km/h</p>
                  <p className="text-gray-600"><strong>Status:</strong> <span className="text-green-600 font-bold">{bus.status || 'ON TIME'}</span></p>
                  <p className="text-gray-400 text-[10px] mt-1">Updated just now</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </DashboardLayout>
  );
}
