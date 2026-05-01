import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

const unwrapResponse = (response) => {
  return response?.data;
};

export const getHealth = async () => {
  const response = await apiClient.get("/health");
  return unwrapResponse(response);
};

export const getDashboard = async (params = {}) => {
  const response = await apiClient.get("/dashboard", { params });
  return unwrapResponse(response);
};

export const getTenants = async (params = {}) => {
  const response = await apiClient.get("/tenants", { params });
  return unwrapResponse(response);
};

export const getBots = async (params = {}) => {
  const response = await apiClient.get("/bots", { params });
  return unwrapResponse(response);
};

export const createTenant = async (payload) => {
  const response = await apiClient.post("/tenants", payload);
  return unwrapResponse(response);
};

export const updateTenant = async (id, payload) => {
  const response = await apiClient.put(`/tenants/${id}`, payload);
  return unwrapResponse(response);
};

export const deleteTenant = async (id) => {
  const response = await apiClient.delete(`/tenants/${id}`);
  return unwrapResponse(response);
};

export const createBot = async (payload) => {
  const response = await apiClient.post("/bots", payload);
  return unwrapResponse(response);
};

export const updateBot = async (id, payload) => {
  const response = await apiClient.put(`/bots/${id}`, payload);
  return unwrapResponse(response);
};

export const deleteBot = async (id) => {
  const response = await apiClient.delete(`/bots/${id}`);
  return unwrapResponse(response);
};

export const sendAiAssistantMessage = async (payload) => {
  const response = await apiClient.post("/ai-assistant/chat", payload);
  return unwrapResponse(response);
};

export const streamAiAssistantMessage = async ({
  payload,
  onChunk,
  onDone,
  onError,
  signal,
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-assistant/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      throw new Error(`AI assistant request failed: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Streaming is not supported by this browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let completed = false;

    while (!completed) {
      const { value, done } = await reader.read();

      completed = done;

      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        onChunk?.(chunk);
      }
    }

    onDone?.();
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    onError?.(error);
  }
};

export default apiClient;
