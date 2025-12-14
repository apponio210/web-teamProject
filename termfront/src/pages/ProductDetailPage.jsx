import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ProductDetail from "../component/ProductDetail";
import { getProductById, transformProductDetail } from "../api/product";

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 16px;
  color: #666;
`;

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 16px;
  color: #c41e3a;
`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      const transformed = transformProductDetail(data);
      setProduct(transformed.product);
      setReviews(transformed.reviews);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  const handleRefresh = () => {
    fetchProduct();
  };

  if (loading) {
    return <LoadingWrapper>로딩 중...</LoadingWrapper>;
  }

  if (error) {
    return <ErrorWrapper>에러: {error}</ErrorWrapper>;
  }

  return (
    <ProductDetail
      product={product}
      reviews={reviews}
      onRefresh={handleRefresh}
    />
  );
};

export default ProductDetailPage;
