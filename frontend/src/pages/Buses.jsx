import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Bus, Plus, Trash2, X, Search } from 'lucide-react';

export default function Buses() {
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ busNumber: '', registrationNumber: '', capacity: '', status: 'INACTIVE' });

  useEffect(() => { fetchBuses(); }, []);

  const fetchBuses = async () => {
    try {
      const { data } = await api.get('/buses');
      setBuses(data);
    } catch (err) {
      setBuses([
        { _id: '1', busNumber: 'Bus 101', registrationNumber: 'TN-43-A-1234', capacity: 50, status: 'ON TIME' },
        { _id: '2', busNumber: 'Bus 202', registrationNumber: 'TN-43-B-5678', capacity: 45, status: 'INACTIVE' },
      ]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/buses', { ...form, capacity: Number(form.capacity) });
      setShowForm(false);
      setForm({ busNumber: '', registrationNumber: '', capacity: '', status: 'INACTIVE' });
      fetchBuses();
    } catch (err) { alert('Error adding bus'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this bus?')) return;
    try { await api.delete('/buses/' + id); fetchBuses(); }
    catch (err) { alert('Error deleting bus'); }
  };

  const statusColors = {
    'ON TIME': 'bg-green-100 text-green-700',
    'DELAYED': 'bg-yellow-100 text-yellow-700',
    'INACTIVE': 'bg-gray-100 text-gray-600',
    'COMPLETED': 'bg-blue-100 text-blue-700',
  };

  const filtered = buses.filter(b => b.busNumber?.toLowerCase().includes(search.toLowerCase()) || b.registrationNumber?.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Bus size={28} /> Manage Buses</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search buses..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-semibold">
            {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Cancel' : 'Add Bus'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Bus</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Bus Number" value={form.busNumber} onChange={(e) => setForm({...form, busNumber: e.target.value})} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            <input type="text" placeholder="Registration Number" value={form.registrationNumber} onChange={(e) => setForm({...form, registrationNumber: e.target.value})} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            <input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-bold">Add Bus</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Bus Number</th>
              <th className="p-4 font-semibold text-gray-600">Registration</th>
              <th className="p-4 font-semibold text-gray-600">Capacity</th>
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
                <td className="p-4"><span className={"px-3 py-1 rounded-full text-xs font-bold " + (statusColors[bus.status] || '')}>{bus.status}</span></td>
                <td className="p-4">
                  <button onClick={() => handleDelete(bus._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">No buses found</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
