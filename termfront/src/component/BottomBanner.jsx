import React from "react";
import styled from "styled-components";

const BannerSection = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 60px;
  padding-top: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const BannerCard = styled.div`
  cursor: pointer;
`;

const BannerImage = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background-image: url(${(props) => props.$image});
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
`;

const BannerTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #212121;
  margin: 0 0 12px 0;
`;

const BannerDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const BottomBanner = () => {
  const banners = [
    {
      id: 1,
      image:
        "https://cdn.allbirds.com/image/upload/f_auto,q_auto/cms/5nVlBmMI8lxdAGJ7RCmxMO/36d8497fba084f7c0be922a9ec89a01a/24Q4_HolidayCampaign_Site_Collection-Card_Comfort_Fern_1440x1080.jpg",
      title: "매일 경험하는 편안함",
      description:
        "올버즈는 마치 구름 위를 걷는 듯한 가벼움과, 바람처럼 자유로운 탄력을 선사합니다. 놀라운 편안함은 긴 여정도 짧은 산책처럼 느끼게합니다.",
    },
    {
      id: 2,
      image:
        "https://cdn.allbirds.com/image/upload/f_auto,q_auto/cms/2awNapgxaMufdxMGuxRFZR/b8aa9b9c0c9c7eab6fbafa7ae1b3f675/24Q4_HolidayCampaign_Site_Collection-Card_Sustainability_Moon_1440x1080.jpg",
      title: "지속 가능한 발걸음",
      description:
        "소재를 고르는 순간부터 신발이 당신에게 닿는 그 순간까지 지구에 남기는 흔적을 줄여갑니다. 탄소 발자국을 제로에 가깝게 줄이려는 노력에 동참해주세요.",
    },
    {
      id: 3,
      image:
        "https://cdn.allbirds.com/image/upload/f_auto,q_auto/cms/6r2uLLWkcsdI8GXHLY0Wr2/a66691ce25c65db6e65f97f1e2730d20/24Q4_HolidayCampaign_Site_Collection-Card_Materials_Wool_1440x1080.jpg",
      title: "지구에서 온 소재",
      description:
        "올버즈는 가능한 모든 곳에서 석유 기반 합성소재를 천연 대안으로 대체합니다. 울, 나무, 사탕수수 같은 자연 소재는 부드럽고 통기성이 좋습니다.",
    },
  ];

  return (
    <BannerSection>
      {banners.map((banner) => (
        <BannerCard key={banner.id}>
          <BannerImage $image={banner.image} />
          <BannerTitle>{banner.title}</BannerTitle>
          <BannerDescription>{banner.description}</BannerDescription>
        </BannerCard>
      ))}
    </BannerSection>
  );
};

export default BottomBanner;
