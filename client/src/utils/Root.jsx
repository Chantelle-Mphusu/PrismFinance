import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";

const Root = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user exists, check role and redirect
    if (user && user.role) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } else {
      // If no user, redirect to login
      navigate("/login");
    }
  }, [user, navigate]);

  return null;
};

export default Root;
