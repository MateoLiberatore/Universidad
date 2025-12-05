const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/analysis`;

export function runAnalysis(token, payload) {
  return sendRequest("POST", "/run", token, payload);
}

export function getHistory(token) {
  return sendRequest("GET", "/history", token);
}

function sendRequest(method, endpoint, token, body = null) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(`${API_URL}${endpoint}`, config).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return response.text().then((msg) => {
      throw new Error(msg || "Error en el servicio de análisis");
    });
  }
  return response.json();
}
