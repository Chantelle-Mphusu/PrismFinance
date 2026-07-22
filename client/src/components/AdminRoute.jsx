import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoute = ({ children }) => {

  const { user, loading } = useAuth();

  // Wait for auth hydration
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

if (user.role && user.role !== "admin") {
  return <Navigate to="/Dashboard" replace />;
}

  // Authorized admin
  return children;
};

export default AdminRoute;