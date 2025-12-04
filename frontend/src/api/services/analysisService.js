const API_URL = import.meta.env.VITE_API_URL + "/analysis";

export async function runAnalysis({ token, files, prompt }) {
  const form = new FormData();
  files.forEach(f => form.append("files", f));
  form.append("prompt", prompt);

  const res = await fetch(`${API_URL}/run`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });

  if (!res.ok) throw new Error("Error en el análisis");

  return res.json();
}

export async function exportAnalysis({ token, table, format }) {
  const res = await fetch(`${API_URL}/export`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ table, format })
  });

  if (!res.ok) throw new Error("Error al exportar");

  return res.blob();
}
