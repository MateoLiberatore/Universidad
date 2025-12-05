const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/prompts`;

export function getPrompts(token) {
  return sendRequest("GET", "/", token);
}

export function createPrompt(token, payload) {
  return sendRequest("POST", "/", token, payload);
}

export function deletePrompt(token, id) {
  return sendRequest("DELETE", `/${id}`, token);
}

function sendRequest(method, endpoint, token, body = null) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) config.body = JSON.stringify(body);

  return fetch(`${API_URL}${endpoint}`, config).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return response.text().then((msg) => {
      throw new Error(msg || "Error en el servicio de prompts");
    });
  }
  return response.json();
}
