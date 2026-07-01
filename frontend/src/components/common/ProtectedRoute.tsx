import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Array<'user' | 'organizer' | 'admin'>;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, roles }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
