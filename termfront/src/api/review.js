import api from "./index";

export const getProductReviews = async (productId) => {
  const response = await api.get(`/api/reviews/product/${productId}`);
  return response.data;
};

export const writeReview = async (productId, rating, comment) => {
  const response = await api.post("/api/reviews/write", {
    productId,
    rating,
    comment,
  });
  return response.data;
};
