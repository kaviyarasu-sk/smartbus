import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboard from '../components/AdminDashboard';
import StudentDashboard from '../components/StudentDashboard';
import DriverDashboard from '../components/DriverDashboard';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const renderDashboard = () => {
    switch (user?.role) {
      case 'ADMIN': return <AdminDashboard />;
      case 'DRIVER': return <DriverDashboard />;
      case 'STUDENT': default: return <StudentDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
}
