import React from "react";
import Button from "./Button";

export default function ListItem(props) {
  const { label, onRemove } = props;

  function handleRemove() {
    if (typeof onRemove === "function") {
      onRemove();
    }
  }

  return (
    <div
      className="
        flex items-center justify-between
        bg-slate-900/60
        border border-slate-800
        rounded-lg
        px-3 py-2
        shadow-sm shadow-black/20
      "
    >
      <span className="text-slate-200 text-sm">&gt; {label}</span>

      <Button
        variant="danger"
        className="w-auto px-3 py-1 text-xs"
        onClick={handleRemove}
      >
        Eliminar
      </Button>
    </div>
  );
}
