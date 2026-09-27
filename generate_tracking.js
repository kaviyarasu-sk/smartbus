const fs = require('fs');
const path = require('path');

const trackingFiles = {
    'frontend/src/pages/LiveTracking.jsx': `import { useEffect, useState } from 'react';
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
    const socket = io('http://localhost:5000');
    
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
`,
    'backend/sockets/tracking.js': `export default function setupTracking(io) {
  // Predefined route coordinates (e.g. Pollachi to Coimbatore area)
  const route = [
    { lat: 10.6558, lng: 77.0090 },
    { lat: 10.7000, lng: 77.0150 },
    { lat: 10.7500, lng: 77.0200 },
    { lat: 10.8000, lng: 77.0300 },
    { lat: 10.8500, lng: 77.0400 },
    { lat: 10.9000, lng: 77.0500 },
    { lat: 10.9500, lng: 77.0600 },
    { lat: 11.0168, lng: 76.9558 } // Coimbatore
  ];

  let currentIndex = 0;
  let direction = 1;

  setInterval(() => {
    const pos = route[currentIndex];
    
    io.emit('busLocationUpdate', {
      busId: 'bus-1',
      routeName: 'Pollachi - Coimbatore',
      lat: pos.lat,
      lng: pos.lng,
      speed: 45 + Math.floor(Math.random() * 10),
      status: 'ON TIME',
      timestamp: new Date()
    });

    currentIndex += direction;
    if (currentIndex >= route.length - 1 || currentIndex <= 0) {
      direction *= -1; // Reverse direction at ends
    }
  }, 3000); // Update every 3 seconds for demo
}
`
};

for (const [filepath, content] of Object.entries(trackingFiles)) {
    const fullPath = path.join('c:/Users/nss/Downloads/New folder/web/smart-bus-tracking', filepath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
}

// Update App.jsx to include the tracking route
const appPath = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/src/App.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');
if (!appCode.includes('LiveTracking')) {
  appCode = appCode.replace("import Register from './pages/Register';", "import Register from './pages/Register';\nimport LiveTracking from './pages/LiveTracking';");
  appCode = appCode.replace("</Routes>", `  <Route path="/tracking" element={<ProtectedRoute><LiveTracking /></ProtectedRoute>} />\n        </Routes>`);
  fs.writeFileSync(appPath, appCode);
}

// Update server.js to include sockets/tracking.js
const serverPath = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/backend/server.js';
let serverCode = fs.readFileSync(serverPath, 'utf8');
if (!serverCode.includes('setupTracking')) {
  serverCode = serverCode.replace("import { connectDB } from './config/db.js';", "import { connectDB } from './config/db.js';\nimport setupTracking from './sockets/tracking.js';");
  serverCode = serverCode.replace(
    "io.on('connection', (socket) => {\n  console.log('Client connected:', socket.id);\n  socket.on('disconnect', () => console.log('Client disconnected'));\n});",
    "io.on('connection', (socket) => {\n  console.log('Client connected:', socket.id);\n  socket.on('disconnect', () => console.log('Client disconnected'));\n});\n\nsetupTracking(io);"
  );
  fs.writeFileSync(serverPath, serverCode);
}
