import React from "react";

export default function PromptEditor({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full p-3 bg-secondary-800 text-primary-100 rounded-md border border-secondary-700 focus:outline-none focus:ring-2 focus:ring-accent-500"
      rows={12}
      placeholder="Escribe tu prompt..."
    />
  );
}
