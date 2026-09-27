import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bus, User, Mail, Lock, Phone, Hash, BookOpen, CreditCard } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT', phone: '', studentId: '', department: '', licenseNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const update = (field) => (e) => setFormData({...formData, [field]: e.target.value});

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bus className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold text-indigo-700">SmartBus</span>
          </div>
          <p className="text-gray-500">Create your account</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User size={18} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Full Name" value={formData.name} onChange={update('name')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>

          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
            <input type="email" placeholder="Email Address" value={formData.email} onChange={update('email')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input type="password" placeholder="Password" value={formData.password} onChange={update('password')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>

          <div className="relative">
            <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
            <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={update('phone')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>

          <select value={formData.role} onChange={update('role')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
            <option value="STUDENT">Student</option>
            <option value="DRIVER">Driver</option>
          </select>

          {formData.role === 'STUDENT' && (
            <>
              <div className="relative">
                <Hash size={18} className="absolute left-3 top-3 text-gray-400" />
                <input type="text" placeholder="Student ID" value={formData.studentId} onChange={update('studentId')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
              </div>
              <div className="relative">
                <BookOpen size={18} className="absolute left-3 top-3 text-gray-400" />
                <input type="text" placeholder="Department" value={formData.department} onChange={update('department')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
            </>
          )}

          {formData.role === 'DRIVER' && (
            <div className="relative">
              <CreditCard size={18} className="absolute left-3 top-3 text-gray-400" />
              <input type="text" placeholder="License Number" value={formData.licenseNumber} onChange={update('licenseNumber')} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
