import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { writeReview } from "../api/review";
import { getProductById } from "../api/product";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #212121;
  margin: 0 0 32px 0;
  text-align: center;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 32px;
`;

const ProductImage = styled.div`
  width: 80px;
  height: 80px;
  background: #e4e0da;
  border-radius: 4px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #212121;
`;

const FormSection = styled.div`
  background: #fff;
  padding: 32px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
`;

const Label = styled.label`
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 12px;
`;

const StarRatingInput = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 36px;
  color: ${(props) => (props.$filled ? "#f5a623" : "#e5e5e5")};
  transition: color 0.2s;
  padding: 0;

  &:hover {
    color: #f5a623;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 24px;

  &:focus {
    outline: none;
    border-color: #212121;
  }

  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  margin-bottom: 24px;

  &:focus {
    outline: none;
    border-color: #212121;
  }

  &::placeholder {
    color: #999;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 16px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:disabled {
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background: #212121;
  color: #fff;

  &:hover {
    background: #000;
  }

  &:disabled {
    background: #ccc;
  }
`;

const CancelButton = styled(Button)`
  background: #fff;
  color: #212121;
  border: 1px solid #ddd;

  &:hover {
    background: #f5f5f5;
  }
`;

const ErrorMessage = styled.p`
  color: #c41e3a;
  font-size: 14px;
  margin: 0 0 16px 0;
`;

const ReviewWritePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productId = searchParams.get("productId");

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error("상품 정보 조회 실패:", err);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("별점을 선택해주세요.");
      return;
    }
    if (title.trim() === "") {
      setError("제목을 입력해주세요.");
      return;
    }
    if (comment.trim() === "") {
      setError("후기 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await writeReview(productId, rating, title, comment);
      alert("리뷰가 등록되었습니다!");
      navigate(-1);
    } catch (err) {
      if (err.response?.status === 400) {
        setError("구매 이력이 없거나 이미 리뷰를 작성했습니다.");
      } else if (err.response?.status === 401) {
        setError("로그인이 필요합니다.");
      } else {
        setError("후기 작성에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Title>리뷰 작성</Title>

      {product && (
        <ProductInfo>
          <ProductImage>
            {product.images?.[0] && (
              <img src={product.images[0]} alt={product.name} />
            )}
          </ProductImage>
          <ProductName>{product.name}</ProductName>
        </ProductInfo>
      )}

      <FormSection>
        <Label>별점</Label>
        <StarRatingInput>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarButton
              key={star}
              $filled={star <= (hoverRating || rating)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              ★
            </StarButton>
          ))}
        </StarRatingInput>

        <Label>제목</Label>
        <Input
          type="text"
          placeholder="리뷰 제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Label>후기</Label>
        <TextArea
          placeholder="상품에 대한 후기를 작성해주세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonRow>
          <CancelButton type="button" onClick={handleCancel}>
            취소
          </CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={loading}>
            {loading ? "등록 중..." : "리뷰 등록"}
          </SubmitButton>
        </ButtonRow>
      </FormSection>
    </Container>
  );
};

export default ReviewWritePage;
