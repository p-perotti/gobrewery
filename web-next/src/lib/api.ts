import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  let token = useAuthStore.getState().token;
  if (!token && typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem("gobrewery-auth");
      if (raw) {
        const persisted = JSON.parse(raw) as { state?: { token?: string } };
        token = persisted.state?.token ?? null;
      }
    } catch {
      token = null;
    }
  }
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().signOut();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
