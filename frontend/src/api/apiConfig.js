const API_BASE_URL = "http://localhost:8080/api";
const REFRESH_SKEW_SECONDS = 60;

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await parseResponseBody(response);
  if (!response.ok || !data?.accessToken) {
    return null;
  }

  localStorage.setItem("accessToken", data.accessToken);
  if (data.role) localStorage.setItem("role", data.role);
  if (data.name) localStorage.setItem("userName", data.name);
  if (data.userId) localStorage.setItem("userId", String(data.userId));
  return data.accessToken;
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

export const apiCall = async (endpoint, method, data = null) => {

  const doRequest = async (token, allowRefreshRetry) => {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await parseResponseBody(response);

    if (response.status === 401 && allowRefreshRetry) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        return doRequest(newAccessToken, false);
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      throw new Error("Session expired. Please sign in again.");
    }

    if (!response.ok) {
      throw new Error(result.message || result || "API request failed");
    }

    return result;
  };

  try {
    const token = await getValidAccessToken();
    return await doRequest(token, true);
  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
};

