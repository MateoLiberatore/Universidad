import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getProfile, logoutUser } from "../api/services/authService";

const AuthContext = createContext();

export function AuthProvider(props) {
  const { children } = props;

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isInitialized, setInitialized] = useState(false);

  function initialize() {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setInitialized(true);
      return;
    }

    getProfile(savedToken)
      .then(function onSuccess(data) {
        setUser(data.user);
        setToken(savedToken);
      })
      .catch(function onError() {
        logoutUser();
      })
      .finally(function onFinally() {
        setInitialized(true);
      });
  }

  useEffect(initialize, []);

  async function handleLogin(email, password) {
    const data = await loginUser(email, password);

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user || null);
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isInitialized,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
