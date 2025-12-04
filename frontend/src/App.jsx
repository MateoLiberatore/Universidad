import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AnalysisPage from "./pages/AnalysisPage";
import PromptsPage from "./pages/PromptsPage";
import NavBar from "../src/components/elements/NavBar";

export default function App() {
  const [token, setToken] = useState("");

  const handleLogin = async (email, pass) => {
  const res = await fetch(import.meta.env.VITE_API_URL + "/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pass })
  });

  const data = await res.json();
  if (data.token) setToken(data.token);
};

  if (!token)
    return <LandingPage onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/analysis" element={<AnalysisPage token={token} />} />
        <Route path="/prompts" element={<PromptsPage token={token} />} />
        <Route path="*" element={<Navigate to="/analysis" />} />
      </Routes>
    </BrowserRouter>
  );
}
