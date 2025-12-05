import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage";
import AnalysisPage from "./pages/AnalysisPage";
import PromptsPage from "./pages/PromptsPage";

export default function App() {
  const auth = useAuth();
  const { user, token, isInitialized } = auth;

  function renderRoutes() {
    return (
      <Routes>
        <Route path="/analysis" element={<AnalysisPage token={token} />} />
        <Route path="/prompts" element={<PromptsPage token={token} />} />
        <Route path="*" element={<Navigate to="/analysis" />} />
      </Routes>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={auth.handleLogin} />;
  }

  return <BrowserRouter>{renderRoutes()}</BrowserRouter>;
}
