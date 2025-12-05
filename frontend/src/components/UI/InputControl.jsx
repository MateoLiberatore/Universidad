import React from "react";

export default function InputControl(props) {
  const {
    id,
    label,
    type = "text",
    value,
    placeholder = "",
    onChange,
    disabled = false,
    className = "",
  } = props;

  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-slate-300">
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className="
          rounded-xl border border-slate-700/80
          bg-slate-900/70
          px-3 py-2
          text-sm text-slate-100
          shadow-sm
          outline-none
          transition
          focus:border-emerald-400
          focus:ring-2 focus:ring-emerald-500/40
          focus:bg-slate-900
        "
      />
    </div>
  );
}
