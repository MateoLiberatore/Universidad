import React from "react";
import PropTypes from "prop-types";
import Button from "../UI/Button";

function DatasetList({ datasets, onSelectDataset, onDeleteDataset, selectedDatasetId, loading = false }) {
  if (loading) {
    return (
      <div className="text-center py-8 text-secondary-500">
        Cargando datasets...
      </div>
    );
  }

  if (!datasets || datasets.length === 0) {
    return (
      <div className="text-center py-8 text-secondary-500">
        No hay datasets guardados. Sube un archivo para comenzar.
      </div>
    );
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getFileIcon(fileType) {
    const icons = {
      pdf: "📄",
      xlsx: "📊",
      xls: "📊",
      csv: "📈",
      json: "📋",
    };
    return icons[fileType] || "📁";
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-primary-200 mb-4">
        Datasets Guardados
      </h3>
      {datasets.map((dataset) => (
        <div
          key={dataset.id}
          className={`
            border rounded-lg p-4 transition-all duration-200
            ${
              selectedDatasetId === dataset.id
                ? "border-primary-500 bg-primary-900/20"
                : "border-secondary-600 bg-secondary-900/50 hover:border-primary-600"
            }
          `}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-2xl">{getFileIcon(dataset.file_type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-primary-100 font-medium truncate">
                  {dataset.filename}
                </p>
                <div className="flex items-center gap-4 mt-1 text-sm text-secondary-500">
                  <span>{formatFileSize(dataset.file_size)}</span>
                  <span>•</span>
                  <span>{formatDate(dataset.uploaded_at)}</span>
                  <span className="px-2 py-0.5 bg-secondary-800 rounded text-xs">
                    {dataset.file_type.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type={selectedDatasetId === dataset.id ? "primary" : "secondary"}
                onClick={() => onSelectDataset(dataset.id)}
                disabled={loading}
                className="!px-3 !py-1 text-sm"
              >
                {selectedDatasetId === dataset.id ? "Seleccionado" : "Seleccionar"}
              </Button>
              <Button
                type="danger"
                onClick={() => onDeleteDataset(dataset.id)}
                disabled={loading}
                className="!px-3 !py-1 text-sm"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

DatasetList.propTypes = {
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      filename: PropTypes.string.isRequired,
      file_type: PropTypes.string.isRequired,
      file_size: PropTypes.number.isRequired,
      uploaded_at: PropTypes.string.isRequired,
    })
  ),
  onSelectDataset: PropTypes.func.isRequired,
  onDeleteDataset: PropTypes.func.isRequired,
  selectedDatasetId: PropTypes.number,
  loading: PropTypes.bool,
};

export default DatasetList;

