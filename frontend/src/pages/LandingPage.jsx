import React from "react";
import Login from "../features/authentication/Login";

export default function LandingPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-secondary-950 text-primary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <Login onLogin={onLogin} />
        <div className="text-center text-xs text-secondary-300">
          <a
            href="/docs"
            className="text-accent-400 hover:text-accent-300"
          >
            Ver documentación de la API
          </a>
        </div>
      </div>
    </div>
  );
}
