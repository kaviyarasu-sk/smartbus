import { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  
  useEffect(() => {
    const fetchRoutes = async () => {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      try {
        const { data } = await axios.get('http://localhost:5000/api/routes', {
          headers: { Authorization: `Bearer ${token}` }
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
