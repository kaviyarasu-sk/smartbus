import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Users, Search, Trash2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      setUsers([
        { _id: '1', name: 'System Admin', email: 'admin@college.edu', role: 'ADMIN', phone: '-', createdAt: new Date() },
        { _id: '2', name: 'John Driver', email: 'driver@college.edu', role: 'DRIVER', phone: '9876543210', createdAt: new Date() },
        { _id: '3', name: 'kaviyarasu sk', email: 'kavi@student.edu', role: 'STUDENT', studentId: 'STU001', department: 'CSE', createdAt: new Date() },
      ]);
    }
  };

  const filtered = users.filter(u =>
    (filterRole === 'ALL' || u.role === filterRole) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const roleColors = {
    ADMIN: 'bg-red-100 text-red-700',
    DRIVER: 'bg-blue-100 text-blue-700',
    STUDENT: 'bg-green-100 text-green-700',
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Users size={28} /> User Management</h2>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="DRIVER">Drivers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Phone</th>
              <th className="p-4 font-semibold text-gray-600">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4"><span className={"px-3 py-1 rounded-full text-xs font-bold " + (roleColors[user.role] || '')}>{user.role}</span></td>
                <td className="p-4 text-gray-500">{user.phone || '-'}</td>
                <td className="p-4 text-gray-400 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
