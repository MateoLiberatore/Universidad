import React from "react";
import PropTypes from "prop-types";

export default function Button(props) {
  const {
    children,
    onClick,
    disabled = false,
    loading = false,
    variant = "primary",
    className = "",
    type = "button",
  } = props;

  const base = {
    primary: `
      rounded-full bg-emerald-500
      px-4 py-2.5
      text-sm font-semibold tracking-wide text-slate-950
      shadow-lg shadow-emerald-500/35
      transition
      hover:bg-emerald-400 hover:shadow-emerald-400/50
      active:translate-y-[1px]
    `,
    secondary: `
      rounded-full bg-slate-700
      px-4 py-2.5
      text-sm font-semibold tracking-wide text-slate-100
      shadow-md shadow-slate-800/40
      transition
      hover:bg-slate-600 hover:shadow-slate-700/50
      active:translate-y-[1px]
    `,
    danger: `
      rounded-full bg-red-600
      px-4 py-2.5
      text-sm font-semibold tracking-wide text-white
      shadow-md shadow-red-700/40
      transition
      hover:bg-red-500 hover:shadow-red-600/50
      active:translate-y-[1px]
    `,
  };

  const classes = `
    ${base[variant]}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  function handleClick(event) {
    if (!disabled && !loading && typeof onClick === "function") {
      onClick(event);
    }
  }

  return (
    <button type={type} className={classes} onClick={handleClick} disabled={disabled}>
      {loading ? "Procesando..." : children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "secondary", "danger"]), 
  type: PropTypes.string,
  className: PropTypes.string,
};
