import React, { useState, useEffect } from "react";
import FileUpload from "../components/analysis/FileUpload";
import PromptEditor from "../components/analysis/PromptEditor";
import AnalysisResults from "../components/analysis/AnalysisResults";
import { runAnalysis, exportAnalysis } from "../api/services/analysisService";
import { listPrompts, createPrompt } from "../api/services/promptService";
import { useLocation } from "react-router-dom";

export default function AnalysisPage({ token }) {
  const location = useLocation();
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState(location.state?.prompt || "");
  const [table, setTable] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saved, setSaved] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!token) return;
    listPrompts(token).then(setSaved).catch(() => {});
  }, [token]);

  const analyze = async () => {
    setError("");
    if (!files.length) {
      setError("Debes cargar archivos.");
      return;
    }
    if (!prompt.trim()) {
      setError("Debes escribir un prompt.");
      return;
    }
    try {
      setLoading(true);
      const result = await runAnalysis({ token, files, prompt });
      setTable(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const savePrompt = async () => {
    if (!prompt.trim() || !title.trim()) {
      setError("Título y prompt requeridos.");
      return;
    }
    try {
      const p = await createPrompt(token, {
        title,
        description: desc,
        prompt_text: prompt
      });
      setSaved(prev => [p, ...prev]);
      setTitle("");
      setDesc("");
    } catch (e) {
      setError(e.message);
    }
  };

  const exportTable = async fmt => {
    try {
      setExporting(true);
      const blob = await exportAnalysis({ token, table, format: fmt });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resultado.${fmt}`;
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {}
    setExporting(false);
  };

  const usePrompt = p => {
    setPrompt(p.prompt_text);
    setShowPicker(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-2xl text-primary-50 font-semibold">Análisis bibliométrico</h1>

      {error && (
        <div className="p-3 bg-amber-900 text-amber-200 rounded-md text-sm border border-amber-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-secondary-950 p-4 rounded-xl border border-secondary-800 space-y-3">
            <h2 className="text-primary-50 text-lg font-medium">Archivos</h2>
            <FileUpload value={files} onChange={setFiles} />
          </div>

          <div className="bg-secondary-950 p-4 rounded-xl border border-secondary-800 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-primary-50 text-lg font-medium">Prompt</h2>
              <button
                className="text-sm px-3 py-1 bg-secondary-800 text-primary-100 rounded-md"
                onClick={() => setShowPicker(true)}
              >
                Usar guardado
              </button>
            </div>

            <PromptEditor value={prompt} onChange={setPrompt} />

            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título del prompt"
              className="w-full p-2 bg-secondary-900 border border-secondary-700 rounded-md text-sm text-primary-50"
            />

            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
              placeholder="Descripción"
              className="w-full p-2 bg-secondary-900 border border-secondary-700 rounded-md text-sm text-primary-50"
            />

            <button
              onClick={savePrompt}
              className="px-4 py-2 bg-accent-600 text-primary-900 rounded-md text-sm"
            >
              Guardar prompt
            </button>
          </div>
        </div>

        <div className="bg-secondary-950 p-4 rounded-xl border border-secondary-800 space-y-4">
          <button
            className="px-4 py-2 bg-accent-600 text-primary-900 rounded-md text-sm"
            onClick={analyze}
            disabled={loading}
          >
            {loading ? "Analizando..." : "Generar tabla"}
          </button>

          <AnalysisResults
            table={table}
            onExport={exportTable}
            exporting={exporting}
          />
        </div>
      </div>

      {showPicker && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-secondary-950 border border-secondary-800 rounded-xl w-full max-w-lg max-h-[80vh] overflow-auto p-4 space-y-4">
            {saved.map(p => (
              <button
                key={p.id}
                onClick={() => usePrompt(p)}
                className="w-full text-left bg-secondary-900 p-3 rounded-md border border-secondary-700 text-primary-100"
              >
                {p.title}
              </button>
            ))}
            <button
              className="w-full mt-3 bg-secondary-800 text-primary-100 py-2 rounded-md"
              onClick={() => setShowPicker(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
