import { useContext } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, BookOpen, Hash } from 'lucide-react';

export default function Profile() {
  const { user } = useContext(AuthContext);

  const fields = [
    { label: 'Full Name', value: user?.name, icon: User },
    { label: 'Email', value: user?.email, icon: Mail },
    { label: 'Role', value: user?.role, icon: BookOpen },
  ];

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="bg-white rounded-lg shadow-sm border p-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
            <User size={40} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-gray-500">{user?.role}</p>
          </div>
        </div>
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <f.icon size={20} className="text-indigo-500" />
              <div>
                <p className="text-xs text-gray-400 uppercase">{f.label}</p>
                <p className="font-medium">{f.value || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
