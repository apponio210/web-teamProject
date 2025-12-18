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

// sizes 배열에서 재고 있는 사이즈만 추출하는 헬퍼 함수
const getAvailableSizesFromSizes = (sizes) => {
  if (!sizes || !Array.isArray(sizes)) return [];
  return sizes.filter((item) => item.stock > 0).map((item) => item.size);
};

// sizes 배열에서 전체 사이즈 추출하는 헬퍼 함수
const getAllSizesFromSizes = (sizes) => {
  if (!sizes || !Array.isArray(sizes)) return [];
  return sizes.map((item) => item.size);
};

export const transformProduct = (item) => ({
  id: item._id,
  name: item.name,
  subtitle: item.short,
  price:
    item.discountRate > 0
      ? Math.round(item.basePrice * (1 - item.discountRate / 100))
      : item.basePrice,
  originalPrice: item.discountRate > 0 ? item.basePrice : null,
  discountRate: item.discountRate,
  image: item.images[0] ? `${API_BASE_URL}${item.images[0]}` : null,
  images: item.images.map((img) => `${API_BASE_URL}${img}`),
  // allSizes: 기존 데이터 우선, 없으면 sizes에서 추출
  allSizes:
    item.allSizes?.length > 0
      ? item.allSizes
      : getAllSizesFromSizes(item.sizes),
  // availableSizes: 기존 데이터 우선, 없으면 sizes에서 stock > 0인 것만 추출
  availableSizes:
    item.availableSizes?.length > 0
      ? item.availableSizes
      : getAvailableSizesFromSizes(item.sizes),
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
      // allSizes: 기존 데이터 우선, 없으면 sizes에서 추출
      allSizes:
        product.allSizes?.length > 0
          ? product.allSizes
          : getAllSizesFromSizes(product.sizes),
      // availableSizes: 기존 데이터 우선, 없으면 sizes에서 stock > 0인 것만 추출
      availableSizes:
        product.availableSizes?.length > 0
          ? product.availableSizes
          : getAvailableSizesFromSizes(product.sizes),
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
