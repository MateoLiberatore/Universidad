import React from "react";

export default function FileUpload({ value = [], onChange }) {
  const handleFiles = e => {
    const files = Array.from(e.target.files);
    onChange(files);
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        multiple
        onChange={handleFiles}
        accept=".pdf,.docx,.doc,.txt"
        className="text-sm text-secondary-200"
      />
      {value.length > 0 && (
        <select
          className="w-full p-2 bg-secondary-800 rounded-md text-primary-100 border border-secondary-700 text-sm"
          size={Math.min(6, value.length)}
        >
          {value.map((f, i) => (
            <option key={i}>{f.name}</option>
          ))}
        </select>
      )}
    </div>
  );
}
