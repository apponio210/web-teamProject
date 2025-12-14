import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "", // 예: http://localhost:8080
  withCredentials: true, // ✅ 세션 쿠키 받기/보내기
  headers: { "Content-Type": "application/json" },
});
