import React, { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Reuse AuthContext — no duplicate API calls
  const auth = useContext(AuthContext);

  return (
    <UserContext.Provider value={auth}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
