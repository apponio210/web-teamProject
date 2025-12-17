import styled from "styled-components";
import { API_BASE_URL } from "../../api";

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

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReviewItem = styled.div`
  padding: 32px 0;
  border-bottom: 1px solid #e5e5e5;
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  gap: 24px;

  &:last-child {
    border-bottom: none;
  }

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
  margin: 0;
`;

const ReviewImage = styled.div`
  margin-top: 12px;

  img {
    max-width: 200px;
    max-height: 200px;
    object-fit: cover;
    border-radius: 4px;
  }
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

const ReviewSection = ({ reviews = [] }) => {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

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
                {review.image && (
                  <ReviewImage>
                    <img src={getImageUrl(review.image)} alt="리뷰 이미지" />
                  </ReviewImage>
                )}
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
