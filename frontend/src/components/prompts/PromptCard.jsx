import React from "react";

export default function PromptCard({ prompt, onUse, onEdit, onDelete }) {
  return (
    <div className="p-4 bg-secondary-950 border border-secondary-800 rounded-xl space-y-2 hover:border-accent-500 transition">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-primary-50 font-semibold">{prompt.title}</h3>
        <span className="text-xs text-secondary-400">
          {new Date(prompt.created_at).toLocaleDateString()}
        </span>
      </div>
      {prompt.description && (
        <p className="text-xs text-secondary-200">{prompt.description}</p>
      )}
      <div className="flex gap-2 pt-2">
        <button
          className="px-3 py-1 text-xs bg-accent-600 text-primary-900 rounded-md"
          onClick={() => onUse(prompt)}
        >
          Usar
        </button>
        <button
          className="px-3 py-1 text-xs bg-secondary-700 text-primary-100 rounded-md"
          onClick={() => onEdit(prompt)}
        >
          Editar
        </button>
        <button
          className="px-3 py-1 text-xs bg-red-700 text-primary-50 rounded-md"
          onClick={() => onDelete(prompt)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
