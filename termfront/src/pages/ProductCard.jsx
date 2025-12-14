import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const CardWrapper = styled.div`
  position: relative;
`;

const Card = styled.div`
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: z-index 0s;

  &:hover {
    z-index: 10;
  }
`;

const CardInner = styled.div`
  padding: 16px;
  margin: -16px;
  background: transparent;
  transition: background 0.2s, box-shadow 0.2s;

  ${Card}:hover & {
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  background-color: #e8e8e8;
  overflow: hidden;
  cursor: pointer;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
`;

const InfoBox = styled.div`
  background: #fff;
  padding: 14px 16px 16px;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Thumbnail = styled.button`
  width: 56px;
  height: 56px;
  padding: 0;
  border: none;
  border-bottom: ${(props) =>
    props.$active ? "2px solid #212121" : "2px solid transparent"};
  background: #e8e8e8;
  cursor: pointer;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  cursor: pointer;
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #212121;
  margin: 0 0 6px 0;
`;

const ProductSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.5;
  min-height: 63px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceWrapper = styled.div`
  font-size: 15px;
  color: #212121;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DiscountRate = styled.span`
  color: #c41e3a;
  font-weight: 600;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  font-size: 14px;
`;

const SalePrice = styled.span`
  font-weight: 600;
`;

const SizeSection = styled.div`
  position: absolute;
  top: 100%;
  left: -16px;
  right: -16px;
  background: white;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 100;

  ${Card}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
`;

const SizeButton = styled.button`
  padding: 10px 4px;
  border: 1px solid ${(props) => (props.$disabled ? "#e5e5e5" : "#d0d0d0")};
  background: ${(props) => (props.$disabled ? "#f5f5f5" : "white")};
  color: ${(props) => (props.$disabled ? "#ccc" : "#212121")};
  font-size: 13px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  text-decoration: ${(props) => (props.$disabled ? "line-through" : "none")};

  &:hover {
    border-color: ${(props) => (props.$disabled ? "#e5e5e5" : "#212121")};
  }
`;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleThumbnailClick = (e, index) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const goToDetail = () => {
    navigate(`/menshoes/${product.id}`);
  };

  const handleSizeClick = (e, size) => {
    e.stopPropagation();
    console.log(`장바구니에 추가: ${product.name} - ${size}`);
  };

  const discountRate = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const allSizes = [
    220, 230, 240, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305,
    310, 315, 320,
  ];
  const sizes = allSizes.map((size) => ({
    size: size.toString(),
    available: product.availableSizes?.includes(size) || false,
  }));

  return (
    <CardWrapper>
      <Card>
        <CardInner>
          <ImageContainer onClick={goToDetail}>
            <ProductImage
              src={product.images?.[currentImageIndex] || product.image}
              alt={product.name}
            />
          </ImageContainer>

          <InfoBox>
            {product.images && product.images.length > 1 && (
              <ThumbnailContainer>
                {product.images.map((img, index) => (
                  <Thumbnail
                    key={index}
                    $active={currentImageIndex === index}
                    onClick={(e) => handleThumbnailClick(e, index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </Thumbnail>
                ))}
              </ThumbnailContainer>
            )}

            <ProductInfo onClick={goToDetail}>
              <ProductName>{product.name}</ProductName>
              <ProductSubtitle>{product.subtitle}</ProductSubtitle>

              <PriceWrapper>
                {discountRate && <DiscountRate>{discountRate}%</DiscountRate>}
                {product.originalPrice ? (
                  <>
                    <SalePrice>₩{product.price.toLocaleString()}</SalePrice>
                    <OriginalPrice>
                      ₩{product.originalPrice.toLocaleString()}
                    </OriginalPrice>
                  </>
                ) : (
                  <span>₩{product.price.toLocaleString()}</span>
                )}
              </PriceWrapper>
            </ProductInfo>
          </InfoBox>

          <SizeSection>
            <SizeGrid>
              {sizes.map((item) => (
                <SizeButton
                  key={item.size}
                  $disabled={!item.available}
                  disabled={!item.available}
                  onClick={(e) => handleSizeClick(e, item.size)}
                >
                  {item.size}
                </SizeButton>
              ))}
            </SizeGrid>
          </SizeSection>
        </CardInner>
      </Card>
    </CardWrapper>
  );
};

export default ProductCard;
