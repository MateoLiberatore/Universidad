import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Button from "../UI/Button";

function FileUpload({ onFileSelect, acceptedTypes = ".xlsx,.xls,.csv,.pdf,.json", disabled = false }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  }

  function handleClick() {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }

  function handleRemove() {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      {!selectedFile ? (
        <div
          onClick={handleClick}
          className={`
            border-2 border-dashed border-secondary-600 rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary-500 hover:bg-primary-900/10"}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-12 h-12 text-secondary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-secondary-400 font-medium">
              Click para seleccionar archivo
            </p>
            <p className="text-sm text-secondary-500">
              Formatos: {acceptedTypes}
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-secondary-600 rounded-lg p-4 bg-secondary-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="text-primary-100 font-medium">{selectedFile.name}</p>
                <p className="text-sm text-secondary-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="secondary"
              onClick={handleRemove}
              disabled={disabled}
              className="!px-3 !py-1 text-sm"
            >
              Eliminar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

FileUpload.propTypes = {
  onFileSelect: PropTypes.func,
  acceptedTypes: PropTypes.string,
  disabled: PropTypes.bool,
};

export default FileUpload;

