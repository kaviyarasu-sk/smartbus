import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Route as RouteIcon, Plus, Trash2, Edit3, X, Search, MapPin, Clock, ArrowRight, Check } from 'lucide-react';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    routeName: '',
    routeNumber: '',
    startPoint: '',
    destination: '',
    stopsInput: '',
    distance: '',
    estimatedDuration: ''
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/routes');
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      // Fallback sample data if needed
      setRoutes([
        { _id: '1', routeName: 'City Center to Main Campus', routeNumber: 'R1', startPoint: 'City Center', destination: 'Main Campus', stops: ['Pollachi', 'Kovilpalayam', 'Kinathukadavu', 'Udumalpet'], distance: 15, estimatedDuration: 45 },
        { _id: '2', routeName: 'Central Bus Station to Main Campus', routeNumber: 'R2', startPoint: 'Central Bus Station', destination: 'Main Campus', stops: ['Town Hall', 'Railway Station', 'Tech Park'], distance: 12, estimatedDuration: 35 },
        { _id: '3', routeName: 'Railway Station to Main Campus', routeNumber: 'R3', startPoint: 'Railway Station', destination: 'Main Campus', stops: ['Gandhi Statue', 'Collectorate', 'Airport Road'], distance: 18, estimatedDuration: 50 }
      ]);
    }
    setLoading(false);
  };

  const handleEditClick = (route) => {
    setEditingId(route._id);
    setForm({
      routeName: route.routeName || '',
      routeNumber: route.routeNumber || '',
      startPoint: route.startPoint || '',
      destination: route.destination || '',
      stopsInput: (route.stops || []).join(', '),
      distance: route.distance || '',
      estimatedDuration: route.estimatedDuration || ''
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
    const stopsArray = form.stopsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      routeName: form.routeName,
      routeNumber: form.routeNumber,
      startPoint: form.startPoint,
      destination: form.destination,
      stops: stopsArray,
      distance: Number(form.distance) || 0,
      estimatedDuration: Number(form.estimatedDuration) || 0
    };

    try {
      if (editingId) {
        // Update / Change existing route
        await api.put(`/routes/${editingId}`, payload);
      } else {
        // Create new route
        await api.post('/routes', payload);
      }
      handleCancel();
      fetchRoutes();
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Error saving route. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      await api.delete(`/routes/${id}`);
      fetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
      alert('Failed to delete route.');
    }
  };

  // Filter routes selectively
  const filteredRoutes = routes.filter(route => {
    const matchesFilter = selectedRouteFilter === 'ALL' || route.routeNumber === selectedRouteFilter || route._id === selectedRouteFilter;
    const query = search.toLowerCase();
    const matchesSearch =
      !search ||
      route.routeName?.toLowerCase().includes(query) ||
      route.routeNumber?.toLowerCase().includes(query) ||
      route.startPoint?.toLowerCase().includes(query) ||
      route.destination?.toLowerCase().includes(query) ||
      (route.stops || []).some(stop => stop.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <RouteIcon className="text-indigo-600" size={28} /> Route Management & Customizer
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create, change, and manage selective bus routes and stops
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setEditingId(null);
              setForm(initialForm);
              setShowForm(true);
            }
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition flex items-center gap-2 font-semibold shadow-sm"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Close Form' : 'Add New Route'}
        </button>
      </div>

      {/* Selective Route Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Route Selector Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
            Select Route:
          </label>
          <select
            value={selectedRouteFilter}
            onChange={(e) => setSelectedRouteFilter(e.target.value)}
            className="w-full md:w-64 p-2.5 border rounded-lg text-sm bg-gray-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ALL">🌟 All Routes ({routes.length})</option>
            {routes.map(r => (
              <option key={r._id} value={r.routeNumber || r._id}>
                Route {r.routeNumber}: {r.routeName}
              </option>
            ))}
          </select>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search stops, start, end..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Add / Edit Route Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 mb-8 animate-fadeIn">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Edit3 size={18} className="text-indigo-600" />
              {editingId ? 'Change / Update Route' : 'Create New Selective Route'}
            </h3>
            <span className="text-xs text-gray-400">All fields are editable</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Route Number *</label>
              <input
                type="text"
                placeholder="e.g. R1, R102, 12A"
                value={form.routeNumber}
                onChange={(e) => setForm({ ...form, routeNumber: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Route Name *</label>
              <input
                type="text"
                placeholder="e.g. City Center to Campus"
                value={form.routeName}
                onChange={(e) => setForm({ ...form, routeName: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Start Point (From) *</label>
              <input
                type="text"
                placeholder="e.g. Pollachi Old Bus Stand"
                value={form.startPoint}
                onChange={(e) => setForm({ ...form, startPoint: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Destination (To) *</label>
              <input
                type="text"
                placeholder="e.g. College Main Gate"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Intermediate Bus Stops (Separate with commas)
              </label>
              <input
                type="text"
                placeholder="e.g. Kovilpalayam, Kinathukadavu, Eachanari, Sundarapuram"
                value={form.stopsInput}
                onChange={(e) => setForm({ ...form, stopsInput: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Distance (km)</label>
                <input
                  type="number"
                  placeholder="e.g. 18"
                  value={form.distance}
                  onChange={(e) => setForm({ ...form, distance: e.target.value })}
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Duration (mins)</label>
                <input
                  type="number"
                  placeholder="e.g. 45"
                  value={form.estimatedDuration}
                  onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })}
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Check size={16} /> {editingId ? 'Save Route Changes' : 'Create Route'}
            </button>
          </div>
        </form>
      )}

      {/* Routes Cards & List */}
      <div className="space-y-4">
        {filteredRoutes.map((route) => (
          <div
            key={route._id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="bg-indigo-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm">
                  Route #{route.routeNumber}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{route.routeName}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={12} className="text-indigo-600" /> {route.estimatedDuration || 45} mins
                    </span>
                    <span>•</span>
                    <span>{route.distance || 15} km</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end lg:self-auto">
                <button
                  onClick={() => handleEditClick(route)}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-indigo-200"
                >
                  <Edit3 size={14} /> Change / Edit
                </button>
                <button
                  onClick={() => handleDelete(route._id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-red-200"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>

            {/* From -> To Path Banner */}
            <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg text-xs font-semibold mb-3">
              <span className="text-green-700 bg-green-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <MapPin size={12} /> {route.startPoint}
              </span>
              <ArrowRight size={14} className="text-gray-400" />
              <span className="text-red-700 bg-red-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <MapPin size={12} /> {route.destination}
              </span>
            </div>

            {/* Intermediate Stops */}
            {route.stops && route.stops.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Selective Stops ({route.stops.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {route.stops.map((stop, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      {stop}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredRoutes.length === 0 && !loading && (
          <div className="bg-white p-12 text-center rounded-xl border border-gray-100">
            <RouteIcon size={44} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-700">No Routes Found</h3>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your route selection filter or click "Add New Route" to create one.
            </p>
            <button
              onClick={() => {
                setSelectedRouteFilter('ALL');
                setSearch('');
              }}
              className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
