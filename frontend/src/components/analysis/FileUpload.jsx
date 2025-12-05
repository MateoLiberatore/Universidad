import React from "react";
import Button from "../UI/Button";

export default function FileUpload(props) {
  const { onFileSelect } = props;

  function handleChange(event) {
    const file = event.target.files[0];
    if (file && onFileSelect) onFileSelect(file);
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        className="
          text-sm text-slate-300
          file:bg-emerald-500 file:text-slate-950
          file:font-semibold file:border-0
          file:rounded-lg file:px-3 file:py-1
          file:mr-4
        "
        onChange={handleChange}
      />
    </div>
  );
}
