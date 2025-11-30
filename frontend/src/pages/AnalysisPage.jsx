import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import NavBar from "../components/elements/NavBar";
import FileUpload from "../components/analysis/FileUpload";
import PromptEditor from "../components/analysis/PromptEditor";
import DatasetList from "../components/analysis/DatasetList";
import AnalysisResults from "../components/analysis/AnalysisResults";
import Button from "../components/UI/Button";
import {
  uploadDataset,
  getDatasets,
  deleteDataset,
  analyzeDataset,
} from "../api/services/datasetService";

// Prompt por defecto para análisis bibliométrico
const DEFAULT_PROMPT = `A continuación se indica qué datos se deben extraer y cómo hacerlo. 

Autoría

Extrae el o los autores de cada artículo, su institución de pertenencia y su país de origen. 

Si se especifica, indicar el rol que cumplen en el desarrollo del artículo utilizando el esquema de contribución de autoría CRediT.

Debes calcular el número de autores que tiene cada artículo.

Si existe más de un autor debes identificar si los autores son de distintos países para poder comprobar si existe colaboración internacional.

La salida debe ser en formato de tabla con la siguiente estructura:

Autores | Afiliación | País | N° de autores | Rol | Colab. Int. 

Cada artículo debe ocupar sólo una línea de la tabla

Cada campo o columna debe consignar los datos de la siguiente manera:

Autores: si el artículo tiene más de un autor, guardarlos en la misma celda separados por ";" y en el orden en que aparecen. Deben consignarse con el formato Apellido, Nombre

Afiliación: si el artículo tiene más de un autor, guardar los nombres de las instituciones de pertenencia en la misma celda, separadas por ";" y en el orden en que aparecen. Si falta afiliación, marcar como ND.

País: si el artículo tiene más de un autor, guardar los nombres de los países de origen en la misma celda, separados por ";" y en el orden en que aparecen. Si no se indica país, asumir el país de la institución. Cuando se identifique el país, devuélvelo en su forma estándar ISO-3166 con el código alfa-3.

N° de autores: calcular el número de autores que tiene cada artículo y consignarlo en esta celda en números arábigos.

Rol: si el archivo especifica el rol que cumplen en el desarrollo del artículo los autores consignarlo utilizando el esquema de contribución de autoría CRediT. Los roles deberán expresarse en el mismo orden en que fueron extraídos los nombres de los autores. Si este dato no figura, marcar como ND.

Colab. Int.: si en el análisis de los países de origen de los autores se detecta que son diferentes marcar la celda como SI. Si son todos del mismo país marcar como NO.`;

function AnalysisPage() {
  const { user, isInitialized } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [outputFormat, setOutputFormat] = useState("json");

  useEffect(() => {
    loadDatasets();
  }, []);

  async function loadDatasets() {
    try {
      setLoadingDatasets(true);
      const response = await getDatasets();
      setDatasets(response.datasets || []);
    } catch (err) {
      setError(err.message || "Error al cargar datasets");
    } finally {
      setLoadingDatasets(false);
    }
  }

  async function handleFileUpload(file) {
    if (!file) {
      setSelectedFile(null);
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const response = await uploadDataset(file);
      await loadDatasets();
      setSelectedDatasetId(response.id);
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || "Error al subir archivo");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteDataset(datasetId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este dataset?")) {
      return;
    }

    try {
      await deleteDataset(datasetId);
      await loadDatasets();
      if (selectedDatasetId === datasetId) {
        setSelectedDatasetId(null);
        setAnalysisResult(null);
      }
    } catch (err) {
      setError(err.message || "Error al eliminar dataset");
    }
  }

  async function handleAnalyze() {
    if (!selectedDatasetId) {
      setError("Por favor selecciona un dataset para analizar");
      return;
    }

    if (!prompt.trim()) {
      setError("Por favor ingresa un prompt de análisis");
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      setAnalysisResult(null);
      const result = await analyzeDataset(selectedDatasetId, prompt, outputFormat);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message || "Error al analizar dataset");
    } finally {
      setAnalyzing(false);
    }
  }

  if (!isInitialized) {
    return <div className="text-center text-primary-100 mt-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-container">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-200 mb-2">
          Análisis Bibliométrico
        </h1>
        <p className="text-secondary-400 mb-8">
          Carga archivos y analiza datos bibliométricos con IA
        </p>

        {error && (
          <div className="mb-6 p-4 bg-terciary-900/20 border border-terciary-600 rounded-lg text-terciary-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Panel izquierdo: Carga y selección */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-primary-200 mb-4">
                Cargar Nuevo Archivo
              </h2>
              <FileUpload
                onFileSelect={setSelectedFile}
                disabled={uploading}
              />
              {selectedFile && (
                <div className="mt-4">
                  <Button
                    type="primary"
                    onClick={() => handleFileUpload(selectedFile)}
                    loading={uploading}
                    className="w-full"
                  >
                    {uploading ? "Subiendo..." : "Subir Archivo"}
                  </Button>
                </div>
              )}
            </div>

            <div className="card">
              <DatasetList
                datasets={datasets}
                onSelectDataset={setSelectedDatasetId}
                onDeleteDataset={handleDeleteDataset}
                selectedDatasetId={selectedDatasetId}
                loading={loadingDatasets}
              />
            </div>
          </div>

          {/* Panel derecho: Prompt y análisis */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-primary-200 mb-4">
                Configuración de Análisis
              </h2>
              <PromptEditor
                value={prompt}
                onChange={setPrompt}
                disabled={analyzing}
              />
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Formato de Salida
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="outputFormat"
                      value="json"
                      checked={outputFormat === "json"}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      disabled={analyzing}
                      className="text-primary-500"
                    />
                    <span className="text-primary-100">JSON</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="outputFormat"
                      value="pdf"
                      checked={outputFormat === "pdf"}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      disabled={analyzing}
                      className="text-primary-500"
                    />
                    <span className="text-primary-100">PDF</span>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="primary"
                  onClick={handleAnalyze}
                  loading={analyzing}
                  disabled={!selectedDatasetId || !prompt.trim()}
                  className="w-full"
                >
                  {analyzing ? "Analizando..." : "Ejecutar Análisis"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {analysisResult && (
          <div className="card">
            <AnalysisResults result={analysisResult} loading={analyzing} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisPage;

