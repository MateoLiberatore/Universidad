import React from "react";
import PropTypes from "prop-types";

function PromptEditor({ value, onChange, placeholder = "Ingresa tu prompt de análisis aquí...", disabled = false }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-primary-200 mb-2">
        Prompt de Análisis
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="
          w-full min-h-[200px] p-4 rounded-lg
          bg-secondary-900 border border-secondary-600
          text-primary-100 placeholder-secondary-500
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-y
          font-mono text-sm
        "
      />
      <p className="mt-2 text-xs text-secondary-500">
        Define las instrucciones específicas para el análisis bibliométrico. El sistema procesará los archivos según estas instrucciones.
      </p>
    </div>
  );
}

PromptEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default PromptEditor;

