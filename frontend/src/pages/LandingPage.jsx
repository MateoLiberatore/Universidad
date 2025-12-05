import React from "react";
import Login from "../features/authentication/Login";

export default function LandingPage(props) {
  const { onLogin } = props;

  function renderDocsLink() {
    return (
      <div className="mt-4 text-xs text-emerald-400">
        <a
          href="/docs"
          className="underline underline-offset-4 hover:text-emerald-300"
        >
          Ver documentación de la API
        </a>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen w-full
        flex items-center
        ps-16
        bg-linear-to-br from-slate-950 via-slate-900 to-black
        text-primary-50
      "
    >
      <div className="w-full max-w-md">
        <Login onLogin={onLogin} />
        {renderDocsLink()}
      </div>
    </div>
  );
}
