import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const MainImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  background-color: #e4e0da;
  overflow: hidden;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ControlsWrapper = styled.div`
  position: absolute;
  bottom: 32px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin: 0 auto;
`;

const ArrowButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ArrowButton = styled.button`
  width: 42px;
  height: 42px;
  border: none;
  background: ${(props) => (props.$direction === "right" ? "#212121" : "#fff")};
  color: ${(props) => (props.$direction === "right" ? "#fff" : "#212121")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  line-height: 1;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.$direction === "right" ? "#000" : "#f0f0f0"};
  }
`;

const IndicatorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Indicator = styled.button`
  width: ${(props) => (props.$active ? "48px" : "30px")};
  height: 2px;
  border: none;
  background: ${(props) => (props.$active ? "#212121" : "#ffffffff")};
  cursor: pointer;
  transition: width 0.3s;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const ProductImages = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultImages = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800",
    "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
  ];

  const imageList = images.length > 0 ? images : defaultImages;

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <Container>
      <MainImageWrapper>
        <MainImage
          src={imageList[currentIndex]}
          alt={`상품 이미지 ${currentIndex + 1}`}
        />

        <ControlsWrapper>
          <ArrowButtons>
            <ArrowButton $direction="left" onClick={goToPrev}>
              ‹
            </ArrowButton>
            <ArrowButton $direction="right" onClick={goToNext}>
              ›
            </ArrowButton>
          </ArrowButtons>

          <IndicatorWrapper>
            {imageList.map((_, index) => (
              <Indicator
                key={index}
                $active={currentIndex === index}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </IndicatorWrapper>
        </ControlsWrapper>
      </MainImageWrapper>
    </Container>
  );
};

export default ProductImages;
