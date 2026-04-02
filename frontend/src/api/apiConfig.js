import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const REFRESH_SKEW_SECONDS = 60;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const inFlightGetRequests = new Map();

const clearSessionStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};

const setTokenPayload = (data) => {
  localStorage.setItem("accessToken", data.accessToken);
  if (data.role) localStorage.setItem("role", data.role);
  if (data.name) localStorage.setItem("userName", data.name);
  if (data.userId) localStorage.setItem("userId", String(data.userId));
};

let refreshPromise = null;

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken })
      .then((response) => {
        const data = response?.data;
        if (!data?.accessToken) {
          return null;
        }
        setTokenPayload(data);
        return data.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const parseJwtPayload = (token) => {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const payload = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch (_) {
    return null;
  }
};

const isTokenExpiringSoon = (token) => {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + REFRESH_SKEW_SECONDS;
};

export const getValidAccessToken = async () => {
  const token = localStorage.getItem("accessToken");

  if (token && !isTokenExpiringSoon(token)) {
    return token;
  }

  const refreshed = await refreshAccessToken();
  if (refreshed) {
    return refreshed;
  }

  return token || null;
};

apiClient.interceptors.request.use(async (config) => {
  const token = await getValidAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const newToken = await refreshAccessToken();

    if (!newToken) {
      clearSessionStorage();
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers || {};
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return apiClient(originalRequest);
  }
);

const executeApiCall = async (endpoint, method, data = null) => {
  try {
    const response = await apiClient({
      url: endpoint,
      method,
      data,
    });
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "API request failed";
    throw new Error(message);
  }
};

export const apiCall = async (endpoint, method, data = null) => {
  const normalizedMethod = String(method || "GET").toUpperCase();

  if (normalizedMethod === "GET" && (data === null || data === undefined)) {
    const key = endpoint;
    const existingRequest = inFlightGetRequests.get(key);
    if (existingRequest) {
      return existingRequest;
    }

    const requestPromise = executeApiCall(endpoint, normalizedMethod, null)
      .finally(() => {
        inFlightGetRequests.delete(key);
      });

    inFlightGetRequests.set(key, requestPromise);
    return requestPromise;
  }

  return executeApiCall(endpoint, normalizedMethod, data);
};

export { apiClient };

