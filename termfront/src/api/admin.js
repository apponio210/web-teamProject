import api from "./index";

export const createProduct = async (formData) => {
  const response = await api.post("/api/admin/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProductSizes = async (productId, availableSizes) => {
  const response = await api.patch(`/api/admin/products/${productId}/sizes`, {
    availableSizes,
  });
  return response.data;
};

export const updateProductDiscount = async (
  productId,
  discountRate,
  saleStart,
  saleEnd
) => {
  const response = await api.patch(
    `/api/admin/products/${productId}/discount`,
    {
      discountRate,
      saleStart,
      saleEnd,
    }
  );
  return response.data;
};

export const getSales = async (startDate, endDate) => {
  const response = await api.get("/api/admin/sales", {
    params: { startDate, endDate },
  });
  return response.data;
};
