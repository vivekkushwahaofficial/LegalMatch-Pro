const API_BASE_URL = "http://localhost:8080/api";

export const apiCall = async (endpoint, method, data = null) => {

  const token = localStorage.getItem("accessToken");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Add JWT token if available
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    const contentType = response.headers.get("content-type");

    let result;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    if (!response.ok) {
      throw new Error(result.message || result || "API request failed");
    }

    return result;

  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
};

