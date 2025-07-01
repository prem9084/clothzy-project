import React, { createContext, useContext, useEffect, useState } from "react";


import axiosInstance from "../axiosInstance/axiosInstance";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUserCheck = async () => {
  
      try {
        const { data } = await axiosInstance.get("/auth/me");
        setUser(data.user);
        setLoading(false);
       
      } catch (error) {
        console.log("Error checking authentication:", error);
      }
    };
    authUserCheck();
  }, [token]);


  

  const value = { user, token, setLoading, setToken, setUser, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
