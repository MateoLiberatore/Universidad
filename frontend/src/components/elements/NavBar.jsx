import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="bg-secondary-950 border-b border-secondary-900">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="text-primary-50 font-semibold">Bibliometric AI</div>
        <nav className="flex gap-4 text-sm">
          <NavLink
            to="/analysis"
            className={({ isActive }) =>
              isActive
                ? "text-accent-400"
                : "text-secondary-300 hover:text-primary-50"
            }
          >
            Análisis
          </NavLink>
          <NavLink
            to="/prompts"
            className={({ isActive }) =>
              isActive
                ? "text-accent-400"
                : "text-secondary-300 hover:text-primary-50"
            }
          >
            Prompts
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
