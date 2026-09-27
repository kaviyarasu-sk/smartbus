import { useNavigate } from 'react-router-dom';
import { Map, Clock, Bell, MessageSquare, User } from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: 'Track Live Bus', desc: 'Find where your bus is right now', icon: Map, color: 'indigo', path: '/tracking' },
    { title: 'Schedules', desc: 'View route timings and stops', icon: Clock, color: 'green', path: '/schedules' },
    { title: 'Notifications', desc: 'Recent alerts and delays', icon: Bell, color: 'yellow', path: '/notifications' },
    { title: 'Complaints', desc: 'Submit or track complaints', icon: MessageSquare, color: 'red', path: '/complaints' },
    { title: 'My Profile', desc: 'View and edit your profile', icon: User, color: 'purple', path: '/profile' },
  ];

  const colorMap = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card.title} onClick={() => navigate(card.path)}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${colorMap[card.color]}`}>
              <card.icon size={32} />
            </div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
