// src/components/UI/NavBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../UI/Button";
import { useAuth } from "../../hooks/useAuth";

function NavBar() {
  const { handleLogout } = useAuth();
  const location = useLocation();

  function handleLogoutClick() {
    handleLogout();
  }

  return (
    <nav className="nav-bar">
      <div className="flex items-center gap-6">
        <h2 className="nav-title text-5xl p-2">&gt; BibliometricAI</h2>
        <div className="flex gap-4">
          <Link
            to="/analysis"
            className={`px-4 py-2 rounded-lg transition-colors ${
              location.pathname === "/analysis"
                ? "bg-primary-700 text-primary-100"
                : "text-secondary-400 hover:text-primary-200 hover:bg-primary-900/30"
            }`}
          >
            Análisis Bibliométrico
          </Link>
        </div>
      </div>
      <Button
        onClick={handleLogoutClick}
        type="danger"
        label="Logout"
      >
        Logout
      </Button>
    </nav>
  );
}

export default NavBar;
