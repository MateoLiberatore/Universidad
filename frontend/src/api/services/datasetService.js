const VITE_HOST_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${VITE_HOST_URL}/api/v1`;

export async function uploadDataset(file) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/datasets/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      let body = {};
      try {
        body = await res.json();
      } catch {}
      throw new Error(body.message || `Error ${res.status} al subir archivo`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(error.message || "Error de conexión al subir archivo.");
  }
}

export async function getDatasets() {
  const token = localStorage.getItem("token");

  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/datasets/`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      let body = {};
      try {
        body = await res.json();
      } catch {}
      throw new Error(body.message || `Error ${res.status} al obtener datasets`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching datasets:", error);
    throw new Error(error.message || "Error de conexión al obtener datasets.");
  }
}

export async function deleteDataset(datasetId) {
  const token = localStorage.getItem("token");

  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/datasets/${datasetId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      let body = {};
      try {
        body = await res.json();
      } catch {}
      throw new Error(body.message || `Error ${res.status} al eliminar dataset`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error deleting dataset:", error);
    throw new Error(error.message || "Error de conexión al eliminar dataset.");
  }
}

export async function analyzeDataset(datasetId, userPrompt, outputFormat = "json") {
  const token = localStorage.getItem("token");

  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/datasets/analyze`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        dataset_id: datasetId,
        user_prompt: userPrompt,
        output_format: outputFormat,
      }),
    });

    if (!res.ok) {
      let body = {};
      try {
        body = await res.json();
      } catch {}
      throw new Error(body.message || `Error ${res.status} en el análisis`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error analyzing dataset:", error);
    throw new Error(error.message || "Error de conexión al analizar dataset.");
  }
}