import styled from "styled-components";

const BannerWrapper = styled.div`
  width: 100%;
  margin: 60px 0;
`;

const BannerImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  display: block;
`;

const LifestyleBanner = ({ image, alt = "라이프스타일 이미지" }) => {
  const defaultImage =
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400";

  return (
    <BannerWrapper>
      <BannerImage src={image || defaultImage} alt={alt} />
    </BannerWrapper>
  );
};

export default LifestyleBanner;
