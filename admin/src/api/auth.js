import { api } from "./client";

export async function login(email, password) {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
}

export async function fetchMe() {
  const res = await api.get("/api/auth/me");
  return res.data;
}

export async function logout() {
  const res = await api.post("/api/auth/logout");
  return res.data;
}
