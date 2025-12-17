import api from "./index";

export const getProductReviews = async (productId) => {
  const response = await api.get(`/api/reviews/product/${productId}`);
  return response.data;
};

export const writeReview = async (productId, rating, title, comment) => {
  const response = await api.post("/api/reviews/write", {
    productId,
    rating,
    title,
    comment,
  });
  return response.data;
};
