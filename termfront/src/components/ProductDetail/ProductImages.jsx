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

const ProductImages = ({ images = [], currentIndex = 0 }) => {
  const defaultImages = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  ];

  const imageList = images.length > 0 ? images : defaultImages;

  return (
    <Container>
      <MainImageWrapper>
        <MainImage
          src={imageList[currentIndex]}
          alt={`상품 이미지 ${currentIndex + 1}`}
        />
      </MainImageWrapper>
    </Container>
  );
};

export default ProductImages;
