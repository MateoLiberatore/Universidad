import React from "react";
import Button from "../UI/Button";

export default function PromptCard(props) {
  const { title, content, onDelete } = props;

  function handleDelete() {
    if (onDelete) onDelete();
  }

  return (
    <div
      className="
        rounded-xl border border-slate-700
        bg-slate-900/60
        p-5 mb-4
        shadow-md shadow-black/30
      "
    >
      <h3 className="text-lg font-semibold text-emerald-400 mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        {content}
      </p>

      <Button variant="danger" className="w-auto px-4 py-1" onClick={handleDelete}>
        Eliminar
      </Button>
    </div>
  );
}
