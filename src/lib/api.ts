import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_MAPBOX_API_URL,
  timeout: 10_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? "No fue posible completar la petición.";

    return Promise.reject(new Error(message));
  },
);
