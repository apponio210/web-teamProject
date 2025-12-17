import { useState } from "react";
import styled from "styled-components";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import Accordion from "./Accordion";
import LifestyleBanner from "./LifestyleBanner";
import FeatureCards from "./FeatureCards";
import ReviewSection from "./ReviewSection";
import InfoCards from "./InfoCards";

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 60px;
  background: #f5f5f5;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const TopSection = styled.div`
  display: flex;
  gap: 60px;
  margin-bottom: 60px;

  @media (max-width: 1024px) {
    gap: 40px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const LeftColumn = styled.div`
  flex: 1.4;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const RightColumn = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const WhiteSection = styled.div`
  background: #fff;
  margin: 0 -60px;
  padding: 60px;

  @media (max-width: 768px) {
    margin: 0 -20px;
    padding: 40px 20px;
  }
`;

const ProductDetail = ({ product, reviews }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <PageContainer>
      <TopSection>
        <LeftColumn>
          <ProductImages
            images={product?.images}
            currentIndex={selectedImageIndex}
          />
          <Accordion />
        </LeftColumn>
        <RightColumn>
          <ProductInfo
            product={product}
            selectedImageIndex={selectedImageIndex}
            onImageSelect={setSelectedImageIndex}
          />
        </RightColumn>
      </TopSection>

      {/* <LifestyleBanner />
      <FeatureCards /> */}

      <ReviewSection reviews={reviews} />
      {/* 
      <WhiteSection>
        <InfoCards />
      </WhiteSection> */}
    </PageContainer>
  );
};

export default ProductDetail;
