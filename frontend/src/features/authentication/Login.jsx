import React, { useState } from "react";
import InputControl from "../../components/UI/InputControl";
import Button from "../../components/UI/Button";

export default function Login(props) {
  const { onLogin } = props;

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePassChange(event) {
    setPass(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (onLogin) {
      onLogin(email, pass);
    }
  }

  function renderHeader() {
    return (
      <div className="text-center space-y-1">
        <p className="text-[0.7rem] tracking-[0.3em] uppercase text-emerald-400">
          laboratorio ia · humanidades
        </p>

        <h1 className="text-3xl font-extrabold tracking-[0.18em]">
          &gt; BibliometricAI
        </h1>
      </div>
    );
  }

  function renderGuestBlock() {
    return (
      <div
        className="
          mt-5
          rounded-xl border border-slate-800
          bg-slate-900/70
          px-4 py-3
          text-[0.78rem] text-slate-400
        "
      >
        <p className="text-[0.7rem] uppercase tracking-wide font-semibold text-slate-300">
          Usuario invitado
        </p>

        <p className="mt-2 font-mono leading-tight">
          email: guest@example.com <br />
          password: guest
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="
          w-full max-w-md
          px-6 py-7
          rounded-2xl border border-slate-800/80
          bg-linear-to-b from-slate-900/95 via-slate-950 to-black
          shadow-2xl shadow-black/60
          backdrop-blur-sm
          space-y-6
          text-slate-50
        "
      >
        {renderHeader()}

        <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
          <InputControl
            id="email"
            label="Correo electrónico"
            type="email"
            value={email}
            placeholder="nombre@institucion.edu"
            onChange={handleEmailChange}
          />

          <InputControl
            id="pass"
            label="Contraseña"
            type="password"
            value={pass}
            placeholder="••••••••"
            onChange={handlePassChange}
          />

          <Button type="submit">Ingresar</Button>
        </form>

        {renderGuestBlock()}
      </div>
    </div>
  );
}
