import { api } from "./client";

export async function fetchSales({ start, end }) {
  const params = new URLSearchParams();
  if (start) params.set("start", start);
  if (end) params.set("end", end);

  const qs = params.toString();
  const res = await api.get(`/api/admin/sales${qs ? `?${qs}` : ""}`);
  return res.data; // 배열 예상
}
