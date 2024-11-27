import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Adjust path as needed
import { Navigation } from '@/components/Navigation';

export const ProtectedLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
