import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';

// Fix Leaflet marker icons issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3204/3204128.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35]
});

export default function LiveTracking() {
  const [buses, setBuses] = useState({});

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    
    socket.on('busLocationUpdate', (data) => {
      setBuses((prevBuses) => ({
        ...prevBuses,
        [data.busId]: data
      }));
    });

    return () => socket.disconnect();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Live Bus Tracking</h2>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 h-[600px] w-full">
        <MapContainer center={[10.6558, 77.0090]} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Object.values(buses).map(bus => (
            <Marker key={bus.busId} position={[bus.lat, bus.lng]} icon={busIcon}>
              <Popup>
                <div className="font-sans">
                  <strong>{bus.routeName || 'College Bus'}</strong><br/>
                  Speed: {bus.speed} km/h<br/>
                  Status: {bus.status}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </DashboardLayout>
  );
}
