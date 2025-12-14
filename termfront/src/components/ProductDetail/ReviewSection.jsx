import { useState } from "react";
import styled from "styled-components";
import { writeReview } from "../../api/review";
const Container = styled.div`
  padding: 60px 0;
`;

const RatingSummary = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const ScoreWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const ScoreNumber = styled.span`
  font-size: 48px;
  font-weight: 600;
  color: #212121;
`;

const Stars = styled.div`
  display: flex;
  gap: 4px;
`;

const Star = styled.span`
  color: ${(props) => (props.$filled ? "#f5a623" : "#e5e5e5")};
  font-size: 24px;
`;

const ReviewCount = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const ReviewFormSection = styled.div`
  background: #f9f9f9;
  padding: 32px;
  margin-bottom: 40px;
  border-radius: 8px;
`;

const FormTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #212121;
  margin: 0 0 20px 0;
`;

const StarRatingInput = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 32px;
  color: ${(props) => (props.$filled ? "#f5a623" : "#e5e5e5")};
  transition: color 0.2s;
  padding: 0;

  &:hover {
    color: #f5a623;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #212121;
  }

  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button`
  padding: 14px 32px;
  background: #212121;
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #000;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #c41e3a;
  font-size: 14px;
  margin: 0 0 16px 0;
`;

const SuccessMessage = styled.p`
  color: #28a745;
  font-size: 14px;
  margin: 0 0 16px 0;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReviewItem = styled.div`
  padding: 32px 0;
  border-bottom: 1px solid #e5e5e5;
  display: grid;
  grid-template-columns: 120px 1fr 100px;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ReviewerName = styled.span`
  font-size: 14px;
  color: #212121;
`;

const ReviewContent = styled.div`
  flex: 1;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const ReviewStars = styled.div`
  display: flex;
  gap: 2px;
`;

const ReviewStar = styled.span`
  color: ${(props) => (props.$filled ? "#f5a623" : "#e5e5e5")};
  font-size: 18px;
`;

const ReviewTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #212121;
`;

const ReviewText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.7;
  margin: 0 0 16px 0;
`;

const ReviewDate = styled.span`
  font-size: 13px;
  color: #999;
  text-align: right;
`;

const NoReviews = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const renderStars = (rating, size = "large") => {
  const stars = [];
  const StarComponent = size === "large" ? Star : ReviewStar;
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <StarComponent key={i} $filled={i <= rating}>
        ★
      </StarComponent>
    );
  }
  return stars;
};

const ReviewSection = ({ productId, reviews = [], onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("별점을 선택해주세요.");
      return;
    }
    if (comment.trim() === "") {
      setError("후기 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await writeReview(productId, rating, comment);
      setSuccess(true);
      setRating(0);
      setComment("");

      if (onReviewAdded) {
        onReviewAdded();
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err.response?.status === 400) {
        setError("구매 이력이 없거나 입력이 올바르지 않습니다.");
      } else if (err.response?.status === 401) {
        setError("로그인이 필요합니다.");
      } else {
        setError("후기 작성에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <Container>
      <RatingSummary>
        <ScoreWrapper>
          <ScoreNumber>
            {reviews.length > 0 ? averageRating.toFixed(0) : 0}
          </ScoreNumber>
          <Stars>{renderStars(Math.round(averageRating))}</Stars>
        </ScoreWrapper>
        <ReviewCount>
          {reviews.length > 0
            ? `${reviews.length}건의 리뷰 분석 결과입니다.`
            : "아직 리뷰가 없습니다."}
        </ReviewCount>
      </RatingSummary>

      <ReviewFormSection>
        <FormTitle>후기 작성</FormTitle>

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

        <TextArea
          placeholder="상품에 대한 후기를 작성해주세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>후기가 등록되었습니다!</SuccessMessage>}

        <SubmitButton onClick={handleSubmit} disabled={loading}>
          {loading ? "등록 중..." : "후기 등록"}
        </SubmitButton>
      </ReviewFormSection>

      {reviews.length === 0 ? (
        <NoReviews>첫 번째 리뷰를 작성해보세요!</NoReviews>
      ) : (
        <ReviewList>
          {reviews.map((review) => (
            <ReviewItem key={review.id}>
              <ReviewerName>{review.name}</ReviewerName>
              <ReviewContent>
                <ReviewHeader>
                  <ReviewStars>
                    {renderStars(review.rating, "small")}
                  </ReviewStars>
                  {review.title && <ReviewTitle>{review.title}</ReviewTitle>}
                </ReviewHeader>
                <ReviewText>{review.content}</ReviewText>
              </ReviewContent>
              <ReviewDate>{review.date}</ReviewDate>
            </ReviewItem>
          ))}
        </ReviewList>
      )}
    </Container>
  );
};

export default ReviewSection;
