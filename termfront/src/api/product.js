import api, { API_BASE_URL } from "./index";

export const getProducts = async (params = {}) => {
  const response = await api.get("/api/products", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

export const getPopularProducts = async () => {
  const response = await api.get("/api/products/popular");
  return response.data;
};

export const transformProduct = (item) => ({
  id: item._id,
  name: item.name,
  subtitle: item.short, // 👈 shortDesc → short로 변경
  price:
    item.discountRate > 0
      ? Math.round(item.basePrice * (1 - item.discountRate / 100))
      : item.basePrice,
  originalPrice: item.discountRate > 0 ? item.basePrice : null,
  discountRate: item.discountRate,
  image: item.images[0] ? `${API_BASE_URL}${item.images[0]}` : null,
  images: item.images.map((img) => `${API_BASE_URL}${img}`),
  allSizes: item.allSizes,
  availableSizes: item.availableSizes,
  materials: item.materials,
  categories: item.categories,
  salesCount: item.salesCount,
  createdAt: item.createdAt,
});

export const transformProducts = (data) => data.map(transformProduct);

export const transformProductDetail = (data) => {
  const { product, reviews } = data;

  return {
    product: {
      id: product._id,
      name: product.name,
      description: product.shortDesc,
      price:
        product.discountRate > 0
          ? Math.round(product.basePrice * (1 - product.discountRate / 100))
          : product.basePrice,
      originalPrice: product.discountRate > 0 ? product.basePrice : null,
      images: product.images.map((img) => `${API_BASE_URL}${img}`),
      allSizes: product.allSizes,
      availableSizes: product.availableSizes,
      materials: product.materials,
      categories: product.categories,
      details: product.details,
      sustainability: product.sustainability,
      care: product.care,
      shippingReturn: product.shippingReturn,
    },
    reviews: reviews.map((review) => ({
      id: review._id,
      name: review.user?.name || "익명",
      rating: review.rating,
      title: review.title || "",
      content: review.comment,
      date: new Date(review.createdAt).toLocaleDateString("ko-KR"),
      image: review.image || null,
    })),
  };
};
