import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  withCredentials: true, // ✅ 세션 쿠키
  headers: { "Content-Type": "application/json" },
});
