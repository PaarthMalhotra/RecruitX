const BASE_URL = (import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

const resolveUrl = (url) => {
  if (typeof url !== "string") return url;
  if (url.startsWith("http://localhost:3000")) {
    return url.replace("http://localhost:3000", BASE_URL);
  }
  if (url.startsWith("/")) {
    return `${BASE_URL}${url}`;
  }
  return url;
};

export const postrequest = async (url, data = {}) => {
  try {
    const request = await fetch(resolveUrl(url), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await request.json();
    return response;
  } catch (error) {
    console.error("POST request error:", error);
    return { success: false, error: error.message };
  }
};

export const getrequest = async (url) => {
  try {
    const request = await fetch(resolveUrl(url), {
      credentials: "include",
    });
    const response = await request.json();
    return response;
  } catch (error) {
    console.error("GET request error:", error);
    return { success: false, error: error.message };
  }
};

export const patchrequest = async (url, data = {}) => {
  try {
    const request = await fetch(resolveUrl(url), {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await request.json();
    return response;
  } catch (error) {
    console.error("PATCH request error:", error);
    return { success: false, error: error.message };
  }
};

export const deleterequest = async (url, data = {}) => {
  try {
    const request = await fetch(resolveUrl(url), {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await request.json();
    return response;
  } catch (error) {
    console.error("DELETE request error:", error);
    return { success: false, error: error.message };
  }
};