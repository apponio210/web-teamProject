import api from "./index";

export const getCart = async () => {
  const response = await api.get("/api/cart");
  return response.data;
};

export const addToCart = async (productId, size, quantity = 1) => {
  const response = await api.post("/api/cart/add", {
    productId,
    size,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (productId, size, quantity) => {
  const response = await api.patch("/api/cart/item", {
    productId,
    size,
    quantity,
  });
  return response.data;
};

export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/api/cart/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/api/cart/clear");
  return response.data;
};
