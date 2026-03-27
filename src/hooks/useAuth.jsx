import { useContext, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";

// API_URL proxied by Vite: /auth, /users -> localhost:5000

export default function useAuth() {
  const { user, logout, fetchUser, loading } = useContext(AuthContext);

  const isAdmin = user && ["SUPERADMIN", "ADMIN"].includes(user.role);
  const isPartner = user && user.role === "PARTNER";
  const isCustomer = user && user.role === "CUSTOMER";

  const refresh = useCallback(async () => {
    if (!user) return;
    await fetchUser();
  }, [user, fetchUser]);

  return { user, logout, loading, isAdmin, isPartner, isCustomer, refresh };
}
