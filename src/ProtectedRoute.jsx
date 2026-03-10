import React, { useEffect } from "react";
import useAuth from "./hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (roles && roles.length > 0 && !roles.includes(user.role)) {
      navigate("/");
    }
  }, [user, loading, roles, navigate]);

  if (loading || user === null) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}