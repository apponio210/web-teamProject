import { api } from "./client";

export async function fetchProducts() {
  const res = await api.get("/api/products");
  return res.data; // 배열
}

// ✅ 가용 사이즈 변경
export async function patchProductSizes(id, availableSizesCsv) {
  const res = await api.patch(`/api/admin/products/${id}/sizes`, {
    availableSizes: availableSizesCsv, // "250,255,260"
  });
  return res.data;
}

// ✅ 할인 정책 변경
export async function patchProductDiscount(id, payload) {
  // payload: { discountRate: number, saleStart: "YYYY-MM-DD" or null, saleEnd: "YYYY-MM-DD" or null }
  const res = await api.patch(`/api/admin/products/${id}/discount`, payload);
  return res.data;
}

// 제품 추가
export async function createProduct(formData) {
  const res = await api.post("/api/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
