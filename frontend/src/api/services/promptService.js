const API_URL = import.meta.env.VITE_API_URL + "/prompts";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export async function listPrompts(token) {
  const res = await fetch(`${API_URL}/`, {
    method: "GET",
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Error al obtener prompts");
  return res.json();
}

export async function getPrompt(token, id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Error al cargar prompt");
  return res.json();
}

export async function createPrompt(token, payload) {
  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Error al crear prompt");
  return res.json();
}

export async function updatePrompt(token, id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Error al actualizar prompt");
  return res.json();
}

export async function deletePrompt(token, id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Error al eliminar prompt");
  return res.json();
}
