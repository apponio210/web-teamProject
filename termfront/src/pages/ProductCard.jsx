import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../context/useCart";

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

const ThumbnailWrapper = styled.div`
  position: relative;
  margin-bottom: 14px;
  min-height: 44px;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Thumbnail = styled.button`
  width: 44px;
  height: 44px;
  padding: 0;
  border: 2px solid transparent;
  background: #e8e8e8;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.2s;

  ${(props) =>
    props.$active &&
    `
    border-bottom-color: #212121;
  `}

  &:hover {
    border-color: #212121;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 28px;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 1);
  }

  ${(props) =>
    props.$left &&
    `
    left: 0;
  `}

  ${(props) =>
    props.$right &&
    `
    right: 0;
  `}
`;

const ArrowIcon = styled.span`
  font-size: 18px;
  color: #212121;
  line-height: 1;
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
  position: relative;
  padding: 10px 4px;
  border: 1px solid ${(props) => (props.$disabled ? "#e5e5e5" : "#212121")};
  background: ${(props) => (props.$disabled ? "#f5f5f5" : "white")};
  color: ${(props) => (props.$disabled ? "#ccc" : "#212121")};
  font-size: 13px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  overflow: hidden;

  &:hover {
    background: ${(props) => (props.$disabled ? "#f5f5f5" : "#212121")};
    color: ${(props) => (props.$disabled ? "#ccc" : "#fff")};
    border-color: ${(props) => (props.$disabled ? "#e5e5e5" : "#212121")};
  }

  ${(props) =>
    props.$disabled &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to top left,
        transparent calc(50% - 0.5px),
        #ccc calc(50% - 0.5px),
        #ccc calc(50% + 0.5px),
        transparent calc(50% + 0.5px)
      );
      pointer-events: none;
    }
  `}
`;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const thumbnailRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (thumbnailRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = thumbnailRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [product.images]);

  const scrollThumbnails = (direction) => {
    if (thumbnailRef.current) {
      const scrollAmount = 150;
      thumbnailRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleThumbnailClick = (e, index) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const goToDetail = () => {
    navigate(`/menshoes/${product.id}`);
  };

  const handleSizeClick = (e, size) => {
    e.stopPropagation();
    addToCart(product, size);
  };

  const discountRate = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const sizes = (product.allSizes || []).map((size) => ({
    size,
    available: product.availableSizes?.includes(size) || false,
  }));

  const hasMultipleImages = product.images && product.images.length > 1;

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
            {/* 👇 ThumbnailWrapper를 항상 렌더링, 내부만 조건부 */}
            <ThumbnailWrapper>
              {hasMultipleImages && (
                <>
                  {canScrollLeft && (
                    <ArrowButton
                      $left
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollThumbnails("left");
                      }}
                    >
                      <ArrowIcon>‹</ArrowIcon>
                    </ArrowButton>
                  )}

                  <ThumbnailContainer ref={thumbnailRef}>
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

                  {canScrollRight && (
                    <ArrowButton
                      $right
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollThumbnails("right");
                      }}
                    >
                      <ArrowIcon>›</ArrowIcon>
                    </ArrowButton>
                  )}
                </>
              )}
            </ThumbnailWrapper>

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
