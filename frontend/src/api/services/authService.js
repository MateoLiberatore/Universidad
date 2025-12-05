const API_URL_BASE = `${import.meta.env.VITE_API_URL}/api/v1`;
const AUTH_URL = `${API_URL_BASE}/auth`;

export async function loginUser(email, password) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Error al iniciar sesión");
  }

  return response.json(); // { token, user }
}

export async function getProfile(token) {
  const response = await fetch(`${AUTH_URL}/profile`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el perfil de usuario.");
  }

  return response.json(); // { user }
}

export function logoutUser() {
  localStorage.removeItem("token");
}
