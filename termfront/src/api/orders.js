import { api } from "./client";

export async function fetchMyOrders() {
  const res = await api.get("/api/orders/me");
  return res.data; // 배열
}
