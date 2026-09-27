import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Bus, Plus, Trash2, Edit3, X, Search, Route as RouteIcon } from 'lucide-react';

export default function Buses() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('ALL');

  const initialForm = {
    busNumber: '',
    registrationNumber: '',
    capacity: '',
    status: 'INACTIVE',
    route: ''
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchBuses = async () => {
    try {
      const { data } = await api.get('/buses');
      setBuses(data);
    } catch (err) {
      setBuses([
        { _id: '1', busNumber: 'Bus 101', registrationNumber: 'TN-43-A-1234', capacity: 50, status: 'ON TIME', route: { _id: '1', routeName: 'City Center to Main Campus', routeNumber: 'R1' } },
        { _id: '2', busNumber: 'Bus 202', registrationNumber: 'TN-43-B-5678', capacity: 45, status: 'INACTIVE', route: { _id: '2', routeName: 'Central Bus Station to Main Campus', routeNumber: 'R2' } },
      ]);
    }
  };

  const fetchRoutes = async () => {
    try {
      const { data } = await api.get('/routes');
      setRoutes(data);
    } catch (err) {
      setRoutes([
        { _id: '1', routeName: 'City Center to Main Campus', routeNumber: 'R1' },
        { _id: '2', routeName: 'Central Bus Station to Main Campus', routeNumber: 'R2' },
      ]);
    }
  };

  const handleEdit = (bus) => {
    setEditingId(bus._id);
    setForm({
      busNumber: bus.busNumber || '',
      registrationNumber: bus.registrationNumber || '',
      capacity: bus.capacity || '',
      status: bus.status || 'INACTIVE',
      route: bus.route?._id || bus.route || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      capacity: Number(form.capacity) || 0,
      route: form.route || null
    };

    try {
      if (editingId) {
        await api.put(`/buses/${editingId}`, payload);
      } else {
        await api.post('/buses', payload);
      }
      handleCancel();
      fetchBuses();
    } catch (err) {
      alert('Error saving bus. Please check details.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bus?')) return;
    try {
      await api.delete('/buses/' + id);
      fetchBuses();
    } catch (err) {
      alert('Error deleting bus');
    }
  };

  const statusColors = {
    'ON TIME': 'bg-green-100 text-green-700',
    'DELAYED': 'bg-yellow-100 text-yellow-700',
    'INACTIVE': 'bg-gray-100 text-gray-600',
    'COMPLETED': 'bg-blue-100 text-blue-700',
  };

  const filtered = buses.filter(b => {
    const matchesQuery =
      b.busNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.route?.routeName?.toLowerCase().includes(search.toLowerCase());

    const matchesRoute =
      selectedRouteFilter === 'ALL' ||
      b.route?._id === selectedRouteFilter ||
      b.route?.routeNumber === selectedRouteFilter;

    return matchesQuery && matchesRoute;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bus size={28} className="text-indigo-600" /> Bus Fleet & Route Assignment
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage buses and assign them to selective routes</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (showForm) handleCancel();
              else {
                setEditingId(null);
                setForm(initialForm);
                setShowForm(true);
              }
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-semibold shadow-sm"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Cancel' : 'Add Bus'}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <RouteIcon size={16} className="text-indigo-600" />
          <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Filter by Route:</span>
          <select
            value={selectedRouteFilter}
            onChange={(e) => setSelectedRouteFilter(e.target.value)}
            className="p-2 border rounded-lg text-sm bg-gray-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full md:w-60"
          >
            <option value="ALL">All Routes</option>
            {routes.map(r => (
              <option key={r._id} value={r._id}>
                Route {r.routeNumber}: {r.routeName}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search bus number, registration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Add / Edit Bus Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {editingId ? 'Edit Bus / Change Assigned Route' : 'Add New Bus'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Bus Number</label>
              <input
                type="text"
                placeholder="e.g. Bus 101"
                value={form.busNumber}
                onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Reg Number</label>
              <input
                type="text"
                placeholder="e.g. TN-43-A-1234"
                value={form.registrationNumber}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Capacity</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="ON TIME">ON TIME</option>
                <option value="DELAYED">DELAYED</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Assign Selective Route</label>
              <select
                value={form.route}
                onChange={(e) => setForm({ ...form, route: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">No Route Assigned</option>
                {routes.map(r => (
                  <option key={r._id} value={r._id}>
                    Route {r.routeNumber}: {r.routeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-bold text-sm"
            >
              {editingId ? 'Save Changes' : 'Add Bus'}
            </button>
          </div>
        </form>
      )}

      {/* Bus Fleet Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Bus Number</th>
              <th className="p-4 font-semibold text-gray-600">Registration</th>
              <th className="p-4 font-semibold text-gray-600">Capacity</th>
              <th className="p-4 font-semibold text-gray-600">Assigned Route</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(bus => (
              <tr key={bus._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{bus.busNumber}</td>
                <td className="p-4 text-gray-600">{bus.registrationNumber}</td>
                <td className="p-4">{bus.capacity} seats</td>
                <td className="p-4">
                  {bus.route ? (
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-md font-semibold border border-indigo-100">
                      Route #{bus.route.routeNumber || 'R'}: {bus.route.routeName}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Unassigned</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={"px-3 py-1 rounded-full text-xs font-bold " + (statusColors[bus.status] || '')}>
                    {bus.status}
                  </span>
                </td>
                <td className="p-4 flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(bus)}
                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2 rounded-lg transition"
                    title="Change / Edit Bus"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(bus._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                    title="Delete Bus"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No buses found matching filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
