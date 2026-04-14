import Navbar from '@/components/Navbar';
import AdminDashboardContent from '@/pages/AdminDashboard';

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AdminDashboardContent />
    </div>
  );
}
