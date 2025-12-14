import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  padding: 60px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Card = styled.div`
  text-align: center;
`;

const CardImage = styled.div`
  width: 100%;
  aspect-ratio: 16/10;
  background-color: #f5f5f5;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 4px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease; /* 부드러운 전환 */
  }

  &:hover img {
    transform: scale(1.05); /* 5% 확대 */
  }
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
  line-height: 1.7;
  margin: 0;
  padding: 0 20px;
`;

const InfoCards = ({ cards = [] }) => {
  const defaultCards = [
    {
      id: 1,
      title: "매일 경험하는 편안함",
      description:
        "건축적인 구조와 도구 폴, 뛰어난 기능의 캐시미어, 통풍성으로 원활해질 수 있으며, 장시간의 산책에도 신뢰할 수 있는 착화감.",
      image:
        "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400",
    },
    {
      id: 2,
      title: "지속 가능한 발걸음",
      description:
        "소재는 그곳의 자연에서 지금도 선현이 되고 결국 더 나은 고 친환경 지속 가능한 자연에서 선물한 자연을 되돌려 드립니다.",
      image:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
    },
    {
      id: 3,
      title: "지구에서 온 소재",
      description:
        "자연을은 자연의 대한 것을 기념하며 시작에 기념의 자연의 자연 자연에서 된 자연으로 우리로 다.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    },
  ];

  const cardList = cards.length > 0 ? cards : defaultCards;

  return (
    <Container>
      {cardList.map((card) => (
        <Card key={card.id}>
          <CardImage>
            <img src={card.image} alt={card.title} />
          </CardImage>
          <CardTitle>{card.title}</CardTitle>
          <CardDescription>{card.description}</CardDescription>
        </Card>
      ))}
    </Container>
  );
};

export default InfoCards;
