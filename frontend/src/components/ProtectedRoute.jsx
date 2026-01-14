import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip token check for download page
    if (location.pathname === "/download-reports") {
      return;
    }

    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  // Allow download page without token
  if (location.pathname === "/download-reports") {
    return children;
  }

  // Check token for other pages
  const token = localStorage.getItem("token");
  if (!token) {
    return null; // Will redirect in useEffect
  }

  return children;
}
