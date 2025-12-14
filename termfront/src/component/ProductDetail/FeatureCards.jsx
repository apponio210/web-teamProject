import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 40px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  text-align: left;
`;

const CardImage = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background-color: #f5f5f5;
  margin-bottom: 16px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardLabel = styled.span`
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #212121;
  margin: 0 0 12px 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const FeatureCards = ({ features = [] }) => {
  const defaultFeatures = [
    {
      id: 1,
      label: "프리미엄 소재",
      title: "리사이클 이탈리안 멜트 울",
      description:
        "부드러운 신축성과 가벼운 무게, 수세를 견디는 80% 울 함유로서, 합성이 자연스럽게 감싸주어 최상의 편안함을 제공합니다.",
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400",
    },
    {
      id: 2,
      label: "걷기 노력",
      title: "결여지 않고, 더 그립스럽게",
      description:
        "자연의 노력을 담아 가고인이라면 닿고 지나가 층 전성을 담은 천연이며 물론에서 자연 자연이라 통시 달고.",
      image:
        "https://images.unsplash.com/photo-1606890658317-7d14490b76fd?w=400",
    },
    {
      id: 3,
      label: "핸드 메이드",
      title: "컬러로 완성하는 나만의 스타일",
      description:
        "보편적인 컬러는 일상 날과 편한 자연과 땅으로 캐주얼한 분위기를 주기도를 부담없이 다.",
      image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400",
    },
  ];

  const featureList = features.length > 0 ? features : defaultFeatures;

  return (
    <Container>
      {featureList.map((feature) => (
        <Card key={feature.id}>
          <CardImage>
            <img src={feature.image} alt={feature.title} />
          </CardImage>
          <CardLabel>{feature.label}</CardLabel>
          <CardTitle>{feature.title}</CardTitle>
          <CardDescription>{feature.description}</CardDescription>
        </Card>
      ))}
    </Container>
  );
};

export default FeatureCards;
