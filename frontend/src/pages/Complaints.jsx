import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Complaints() {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', category: 'Bus Delay', busNumber: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch (err) { console.error('Error fetching complaints'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', form);
      setMessage('Complaint submitted successfully!');
      setShowForm(false);
      setForm({ subject: '', description: '', category: 'Bus Delay', busNumber: '' });
      fetchComplaints();
    } catch (err) {
      setMessage('Error submitting complaint');
    }
  };

  const statusIcon = (status) => {
    switch(status) {
      case 'RESOLVED': return <CheckCircle className="text-green-500" size={18} />;
      case 'IN PROGRESS': return <Clock className="text-yellow-500" size={18} />;
      default: return <AlertCircle className="text-red-500" size={18} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Complaints</h2>
        {user?.role === 'STUDENT' && (
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
            <Send size={18} /> New Complaint
          </button>
        )}
      </div>

      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4">Submit New Complaint</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option>Bus Delay</option>
                <option>Driver Issue</option>
                <option>Route Issue</option>
                <option>Technical Issue</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Bus Number (optional)</label>
            <input type="text" value={form.busNumber} onChange={(e) => setForm({...form, busNumber: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" rows="4" required />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Submit</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Subject</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Admin Reply</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? complaints.map(c => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{c.subject}</td>
                <td className="p-4">{c.category}</td>
                <td className="p-4"><span className="flex items-center gap-2">{statusIcon(c.status)} {c.status}</span></td>
                <td className="p-4 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-sm">{c.adminReply || '-'}</td>
              </tr>
            )) : <tr><td colSpan="5" className="p-8 text-center text-gray-400">No complaints yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
