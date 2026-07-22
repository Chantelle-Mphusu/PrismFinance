import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoutes = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check role authorization
    if (requiredRole && !requiredRole.includes(user.role)) {
      navigate('/unauthorized');
      return;
    }
    // ✅ No automatic redirection if authorized
  }, [user, navigate, requiredRole, location]);

  if (!user) return null;

  return children;
};

export default ProtectedRoutes;
