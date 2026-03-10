import { useContext, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function useAuth() {
  const { user, setUser, logout } = useContext(AuthContext);

  const isAdmin = user && ["SUPERADMIN", "ADMIN"].includes(user.role);
  const isPartner = user && user.role === "PARTNER";
  const isCustomer = user && user.role === "CUSTOMER";

  const refresh = useCallback(async () => {
    if (!user) return;
    const res = await fetch((import.meta.env.VITE_API_BASE || "http://localhost:4000") + "/users/me", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    if (res.ok) setUser(await res.json());
  }, [user]);

  return { user, setUser, logout, isAdmin, isPartner, isCustomer, refresh };
}
