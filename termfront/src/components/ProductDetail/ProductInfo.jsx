import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  background: #ffffffff;
  padding: 40px;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
`;

const BreadcrumbLink = styled.span`
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: #999;
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.$active ? "#212121" : "transparent")};
  color: ${(props) => (props.$active ? "#fff" : "#212121")};

  &:hover {
    background: ${(props) => (props.$active ? "#212121" : "#e8e8e8")};
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

const Divider = styled.hr`
  border: none;
  border-top: 2px solid #000000ff;
  margin: 36px 0;
`;

const NaverPaySection = styled.div`
  margin-bottom: 16px;
`;

const NaverPayLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;

  span {
    color: #03c75a;
    font-weight: 700;
  }
`;

const NaverPayButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #03c75a;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.2s;

  &:hover {
    background: #02b350;
  }
`;

const NaverN = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #fff;
  color: #03c75a;
  font-weight: 700;
  font-size: 12px;
  border-radius: 4px;
`;

const NaverPayEventRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 13px;
  padding-top: 12px;
  border-top: 1px solid #e5e5e5;
`;

const NaverPayEventLink = styled.span`
  color: #212121;
  cursor: pointer;

  span {
    color: #03c75a;
  }
`;

const NaverPayArrows = styled.div`
  display: flex;
  gap: 0;

  button {
    width: 24px;
    height: 24px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    font-size: 12px;
    color: #999;

    &:first-child {
      border-right: none;
    }

    &:hover {
      background: #f5f5f5;
    }
  }
`;

const FitGuideSection = styled.div`
  margin-top: 32px;
  padding-top: 24px;
`;

const FitGuideHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const FitGuideTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #212121;
`;

const FitGuideLink = styled.span`
  font-size: 14px;
  color: #212121;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #666;
  }
`;

const FitGuideBarWrapper = styled.div`
  position: relative;
`;

const FitGuideBars = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
`;

const FitGuideBar = styled.div`
  flex: 1;
  height: 4px;
  background: ${(props) => (props.$filled ? "#03c75a" : "#e5e5e5")};
`;

const FitGuideLabels = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FitGuideLabel = styled.span`
  font-size: 13px;
  color: #666;
`;

const StoreStockSection = styled.div`
  margin-top: 24px;
`;

const StoreStockTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #212121;
  cursor: pointer;
  margin-bottom: 8px;
`;

const StoreStockDesc = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
`;

const ProductInfo = ({ product = {} }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedGender, setSelectedGender] = useState("men");
  const [selectedSize, setSelectedSize] = useState(null);

  const allSizes = [
    250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310,
  ];
  const sizes = allSizes.map((size) => ({
    size,
    available: product.availableSizes?.includes(size) || false,
  }));

  const formatPrice = (value) => `₩${value?.toLocaleString() || 0}`;

  const discountRate = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbLink>🏠 Home</BreadcrumbLink>
        <BreadcrumbSeparator>›</BreadcrumbSeparator>
        <span>{product.name}</span>
      </Breadcrumb>

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
          <SectionHeader>
            <SectionLabel>색상</SectionLabel>
          </SectionHeader>
          <ColorGrid>
            {product.images.map((image, index) => (
              <ColorButton
                key={index}
                $active={selectedImageIndex === index}
                onClick={() => setSelectedImageIndex(index)}
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
        <GenderButton
          $active={selectedGender === "women"}
          onClick={() => setSelectedGender("women")}
        >
          여성
        </GenderButton>
      </GenderToggle>

      <Section>
        <SectionLabel>사이즈</SectionLabel>
        <div style={{ marginTop: "16px" }}>
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
        </div>
      </Section>

      <Divider />

      <NaverPaySection>
        <NaverPayLabel>
          <span>NAVER</span>네이버ID로 간편구매
        </NaverPayLabel>
        <NaverPayButton>
          <NaverN>N</NaverN>
          <span>pay 구매</span>
        </NaverPayButton>
        <NaverPayEventRow>
          <NaverPayEventLink>
            <span>이벤트</span> 네이버페이
          </NaverPayEventLink>
          <NaverPayArrows>
            <button>‹</button>
            <button>›</button>
          </NaverPayArrows>
        </NaverPayEventRow>
      </NaverPaySection>

      <FitGuideSection>
        <FitGuideHeader>
          <FitGuideTitle>핏 가이드</FitGuideTitle>
          <FitGuideLink>자세한 가이드</FitGuideLink>
        </FitGuideHeader>
        <FitGuideBarWrapper>
          <FitGuideBars>
            <FitGuideBar $filled />
            <FitGuideBar $filled />
            <FitGuideBar />
          </FitGuideBars>
          <FitGuideLabels>
            <FitGuideLabel>작게나옴</FitGuideLabel>
            <FitGuideLabel>정사이즈</FitGuideLabel>
            <FitGuideLabel>크게나옴</FitGuideLabel>
          </FitGuideLabels>
        </FitGuideBarWrapper>
      </FitGuideSection>

      <StoreStockSection>
        <StoreStockTitle>오프라인 매장 재고 확인</StoreStockTitle>
        <StoreStockDesc>
          사이즈를 선택하시면 재고가 있는 매장을 확인할 수 있습니다.
        </StoreStockDesc>
      </StoreStockSection>
    </Container>
  );
};

export default ProductInfo;
