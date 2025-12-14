import { api } from "./client";

export async function login(email, password) {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data; // { id, email, name, phone, role }
}
