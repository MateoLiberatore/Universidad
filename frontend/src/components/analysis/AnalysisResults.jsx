import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "../UI/Button";

function AnalysisResults({ result, loading = false }) {
  const [activeTab, setActiveTab] = useState("json");

  function downloadJSON() {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analisis_bibliometrico_${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function downloadPDF() {
    if (!result || !result.pdf_base64) return;
    
    const byteCharacters = atob(result.pdf_base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analisis_bibliometrico_${new Date().getTime()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="border border-secondary-600 rounded-lg p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-secondary-500">Procesando análisis...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="border border-secondary-600 rounded-lg p-8 text-center text-secondary-500">
        No hay resultados para mostrar. Ejecuta un análisis primero.
      </div>
    );
  }

  const displayResult = result.result || result;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary-200">Resultados del Análisis</h3>
        <div className="flex gap-2">
          <Button type="secondary" onClick={downloadJSON} className="!px-4 !py-2">
            Descargar JSON
          </Button>
          {result.pdf_base64 && (
            <Button type="primary" onClick={downloadPDF} className="!px-4 !py-2">
              Descargar PDF
            </Button>
          )}
        </div>
      </div>

      <div className="border border-secondary-600 rounded-lg overflow-hidden">
        <div className="flex border-b border-secondary-600">
          <button
            onClick={() => setActiveTab("json")}
            className={`
              px-4 py-2 font-medium transition-colors
              ${
                activeTab === "json"
                  ? "bg-primary-900/30 text-primary-200 border-b-2 border-primary-500"
                  : "text-secondary-500 hover:text-primary-200"
              }
            `}
          >
            JSON
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`
              px-4 py-2 font-medium transition-colors
              ${
                activeTab === "table"
                  ? "bg-primary-900/30 text-primary-200 border-b-2 border-primary-500"
                  : "text-secondary-500 hover:text-primary-200"
              }
            `}
          >
            Tabla
          </button>
        </div>

        <div className="p-4 bg-secondary-900/50 max-h-[600px] overflow-auto">
          {activeTab === "json" ? (
            <pre className="text-sm text-primary-100 font-mono whitespace-pre-wrap">
              {JSON.stringify(displayResult, null, 2)}
            </pre>
          ) : (
            <div className="overflow-x-auto">
              {Array.isArray(displayResult) && displayResult.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary-800">
                      {Object.keys(displayResult[0]).map((key) => (
                        <th
                          key={key}
                          className="border border-secondary-600 px-4 py-2 text-left text-primary-200 font-semibold"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-secondary-800/50">
                        {Object.values(row).map((value, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="border border-secondary-600 px-4 py-2 text-primary-100"
                          >
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : typeof displayResult === "object" ? (
                <table className="w-full border-collapse">
                  <tbody>
                    {Object.entries(displayResult).map(([key, value]) => (
                      <tr key={key} className="hover:bg-secondary-800/50">
                        <td className="border border-secondary-600 px-4 py-2 bg-secondary-800 text-primary-200 font-semibold">
                          {key}
                        </td>
                        <td className="border border-secondary-600 px-4 py-2 text-primary-100">
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-primary-100">{String(displayResult)}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

AnalysisResults.propTypes = {
  result: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool,
};

export default AnalysisResults;

