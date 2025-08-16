import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, fallback = '/login' }) {
  const { isAuthed, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-zinc-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    // Redirect to login page, but save the attempted location
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  return children;
}
