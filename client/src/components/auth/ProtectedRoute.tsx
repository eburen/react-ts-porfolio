import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { CircularProgress, Box } from '@mui/material';
import { useEffect } from 'react';
import { fetchCurrentUser } from '../../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status if there's a token but not authenticated
    if (!isAuthenticated && localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    // Store the current location so we can redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect to home if admin access is required but user is not an admin
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute; 