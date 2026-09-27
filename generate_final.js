const fs = require('fs');
const path = require('path');

const files = {
    'backend/controllers/busController.js': `import Bus from '../models/Bus.js';
export const getBuses = async (req, res) => {
  try { const buses = await Bus.find().populate('driver route'); res.json(buses); }
  catch (error) { res.status(500).json({ message: error.message }); }
};
export const addBus = async (req, res) => {
  try { const bus = await Bus.create(req.body); res.status(201).json(bus); }
  catch (error) { res.status(400).json({ message: error.message }); }
};
export const deleteBus = async (req, res) => {
  try { await Bus.findByIdAndDelete(req.params.id); res.json({ message: 'Bus deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
};
`,
    'backend/routes/busRoutes.js': `import express from 'express';
import { getBuses, addBus, deleteBus } from '../controllers/busController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(protect, getBuses).post(protect, addBus);
router.route('/:id').delete(protect, deleteBus);
export default router;
`,
    'backend/controllers/routeController.js': `import Route from '../models/Route.js';
export const getRoutes = async (req, res) => {
  try { const routes = await Route.find(); res.json(routes); }
  catch (error) { res.status(500).json({ message: error.message }); }
};
export const addRoute = async (req, res) => {
  try { const route = await Route.create(req.body); res.status(201).json(route); }
  catch (error) { res.status(400).json({ message: error.message }); }
};
export const deleteRoute = async (req, res) => {
  try { await Route.findByIdAndDelete(req.params.id); res.json({ message: 'Route deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
};
`,
    'backend/routes/routeRoutes.js': `import express from 'express';
import { getRoutes, addRoute, deleteRoute } from '../controllers/routeController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(protect, getRoutes).post(protect, addRoute);
router.route('/:id').delete(protect, deleteRoute);
export default router;
`,
    'frontend/src/pages/Buses.jsx': `import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

export default function Buses() {
  const [buses, setBuses] = useState([]);
  
  useEffect(() => {
    const fetchBuses = async () => {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      try {
        const { data } = await axios.get('http://localhost:5000/api/buses', {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        setBuses(data);
      } catch (error) { console.error('Error fetching buses'); }
    };
    fetchBuses();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Buses</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Add New Bus</button>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Bus Number</th>
              <th className="p-4">Reg Number</th>
              <th className="p-4">Capacity</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.length > 0 ? buses.map(bus => (
              <tr key={bus._id} className="border-b">
                <td className="p-4">{bus.busNumber}</td>
                <td className="p-4">{bus.registrationNumber}</td>
                <td className="p-4">{bus.capacity}</td>
                <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">{bus.status}</span></td>
                <td className="p-4"><button className="text-red-500 hover:underline">Delete</button></td>
              </tr>
            )) : <tr><td colSpan="5" className="p-4 text-center text-gray-500">No buses found. Add some sample data!</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
`,
    'frontend/src/pages/Routes.jsx': `import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  
  useEffect(() => {
    const fetchRoutes = async () => {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      try {
        const { data } = await axios.get('http://localhost:5000/api/routes', {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        setRoutes(data);
      } catch (error) { console.error('Error fetching routes'); }
    };
    fetchRoutes();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Routes</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Add New Route</button>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Route Name</th>
              <th className="p-4">Start Point</th>
              <th className="p-4">Destination</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.length > 0 ? routes.map(route => (
              <tr key={route._id} className="border-b">
                <td className="p-4">{route.routeName}</td>
                <td className="p-4">{route.startPoint}</td>
                <td className="p-4">{route.destination}</td>
                <td className="p-4"><button className="text-red-500 hover:underline">Delete</button></td>
              </tr>
            )) : <tr><td colSpan="4" className="p-4 text-center text-gray-500">No routes found.</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
    const fullPath = path.join('c:/Users/nss/Downloads/New folder/web/smart-bus-tracking', filepath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
}

// Update App.jsx to include Buses and Routes
const appPath = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/frontend/src/App.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');
if (!appCode.includes('import Buses')) {
  appCode = appCode.replace("import LiveTracking from './pages/LiveTracking';", "import LiveTracking from './pages/LiveTracking';\nimport Buses from './pages/Buses';\nimport RoutesPage from './pages/Routes';");
  appCode = appCode.replace("</Routes>", `  <Route path="/buses" element={<ProtectedRoute><Buses /></ProtectedRoute>} />\n          <Route path="/routes" element={<ProtectedRoute><RoutesPage /></ProtectedRoute>} />\n        </Routes>`);
  fs.writeFileSync(appPath, appCode);
}

// Update server.js to include Bus and Route APIs
const serverPath = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/backend/server.js';
let serverCode = fs.readFileSync(serverPath, 'utf8');
if (!serverCode.includes('busRoutes')) {
  serverCode = serverCode.replace("import authRoutes from './routes/authRoutes.js';", "import authRoutes from './routes/authRoutes.js';\nimport busRoutes from './routes/busRoutes.js';\nimport routeRoutes from './routes/routeRoutes.js';");
  serverCode = serverCode.replace("app.use('/api/auth', authRoutes);", "app.use('/api/auth', authRoutes);\napp.use('/api/buses', busRoutes);\napp.use('/api/routes', routeRoutes);");
  fs.writeFileSync(serverPath, serverCode);
}
