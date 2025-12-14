import { useState } from "react";
import styled from "styled-components";
import { useCart } from "../../context/useCart";

const Container = styled.div`
  width: 100%;
  background: #fff;
  padding: 40px;
`;

const ProductName = styled.h1`
  font-size: 32px;
  font-weight: 400;
  color: #212121;
  margin: 0 0 16px 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const Price = styled.span`
  font-size: 18px;
  font-weight: 400;
  color: #212121;
`;

const OriginalPrice = styled.span`
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
`;

const DiscountRate = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #c41e3a;
`;

const Description = styled.p`
  font-size: 15px;
  color: #555;
  line-height: 1.8;
  margin: 0 0 36px 0;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #212121;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
`;

const ColorButton = styled.button`
  width: 100%;
  aspect-ratio: 1;
  padding: 0;
  border: none;
  border-bottom: ${(props) =>
    props.$active ? "2px solid #212121" : "2px solid transparent"};
  background: transparent;
  cursor: pointer;
  transition: border 0.2s;
  overflow: hidden;

  &:hover {
    border-bottom-color: #212121;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GenderToggle = styled.div`
  display: flex;
  background: #f5f5f5;
  margin-bottom: 32px;
`;

const GenderButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  background: ${(props) => (props.$active ? "#212121" : "transparent")};
  color: ${(props) =>
    props.$active ? "#fff" : props.$disabled ? "#ccc" : "#212121"};

  &:hover {
    background: ${(props) =>
      props.$disabled ? "transparent" : props.$active ? "#212121" : "#e8e8e8"};
  }
`;

const SizeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StockBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    background: #4caf50;
    border-radius: 50%;
  }
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
`;

const SizeButton = styled.button`
  position: relative;
  padding: 14px 8px;
  border: 1px solid ${(props) => (props.$active ? "#212121" : "#e0e0e0")};
  background: #fff;
  color: ${(props) => (props.$disabled ? "#ccc" : "#212121")};
  font-size: 14px;
  font-weight: 400;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  overflow: hidden;

  &:hover {
    border-color: ${(props) => (props.$disabled ? "#e0e0e0" : "#212121")};
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

const AddToCartButton = styled.button`
  width: 100%;
  padding: 18px;
  background: #212121;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  border: none;
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

const ProductInfo = ({
  product = {},
  selectedImageIndex = 0,
  onImageSelect,
}) => {
  const [selectedGender, setSelectedGender] = useState("men");
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart } = useCart();

  const allSizes = [
    220, 230, 240, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305,
    310, 315, 320,
  ];
  const sizes = allSizes.map((size) => ({
    size,
    available: product.availableSizes?.includes(size) || false,
  }));

  const formatPrice = (value) => `₩${value?.toLocaleString() || 0}`;

  const discountRate = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (selectedSize && product) {
      addToCart(product, selectedSize);
    }
  };

  return (
    <Container>
      <ProductName>{product.name}</ProductName>

      <PriceWrapper>
        {discountRate && <DiscountRate>{discountRate}%</DiscountRate>}
        <Price>{formatPrice(product.price)}</Price>
        {product.originalPrice && (
          <OriginalPrice>{formatPrice(product.originalPrice)}</OriginalPrice>
        )}
      </PriceWrapper>

      <Description>{product.description}</Description>

      {product.images && product.images.length > 1 && (
        <Section>
          <ColorGrid>
            {product.images.map((image, index) => (
              <ColorButton
                key={index}
                $active={selectedImageIndex === index}
                onClick={() => onImageSelect(index)}
              >
                <img src={image} alt={`옵션 ${index + 1}`} />
              </ColorButton>
            ))}
          </ColorGrid>
        </Section>
      )}

      <GenderToggle>
        <GenderButton
          $active={selectedGender === "men"}
          onClick={() => setSelectedGender("men")}
        >
          남성
        </GenderButton>
        <GenderButton $active={selectedGender === "women"} $disabled={true}>
          여성
        </GenderButton>
      </GenderToggle>

      <Section>
        <SizeHeader>
          <SectionLabel>사이즈</SectionLabel>
          <StockBadge>재고 있음</StockBadge>
        </SizeHeader>
        <SizeGrid>
          {sizes.map((item) => (
            <SizeButton
              key={item.size}
              $active={selectedSize === item.size}
              $disabled={!item.available}
              onClick={() => item.available && setSelectedSize(item.size)}
            >
              {item.size}
            </SizeButton>
          ))}
        </SizeGrid>
      </Section>

      {selectedSize && (
        <AddToCartButton onClick={handleAddToCart}>
          장바구니 담기 · {formatPrice(product.price)}
        </AddToCartButton>
      )}
    </Container>
  );
};

export default ProductInfo;
