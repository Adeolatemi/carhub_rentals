import React, { useContext, useEffect } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedAdmin({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return; // AuthProvider loads user asynchronously; let it finish.
    const isAdmin = ["SUPERADMIN", "ADMIN", "PARTNER"].includes(user.role);
    if (!isAdmin) navigate("/");
  }, [user]);

  return <>{children}</>;
}
