import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = async e => {
    e.preventDefault();
    const res = await onLogin(email, pass);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 bg-secondary-900 border border-secondary-700 rounded-md text-primary-50"
        />
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="Contraseña"
          className="w-full p-2 bg-secondary-900 border border-secondary-700 rounded-md text-primary-50"
        />
        <button
          type="submit"
          className="w-full py-2 bg-accent-600 text-primary-900 rounded-md"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
