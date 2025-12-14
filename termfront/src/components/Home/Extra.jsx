// src/components/Extra/Extra.jsx
import React, { useMemo } from "react";
import styled from "styled-components";

export default function Extra() {
  const items = useMemo(
    () => [
      {
        id: 1,
        title: "매일 경험하는 편안함",
        desc: `올버는 마치 구름 위를 걷는 듯한 가벼움과, 바람처럼
        자유로운 탄력을 선사합니다. 놀라운 편안함은 긴 여정도 
        짧은 산책처럼 느껴집니다.`,
        img: "/extra1.webp",
      },
      {
        id: 2,
        title: "지속 가능한 발걸음",
        desc: `소재를 고르는 순간부터 신발이 당신에게 닿는 그 순간까지
         지구에 남기는 흔적을 헤아립니다. 탄소 발자국을 
        제로에 가깝게 줄이려는 노력에 동참해주세요.`,
        img: "/extra2.webp",
      },
      {
        id: 3,
        title: "지구에서 온 소재",
        desc: `올버즈는 가능한 모든 곳에서 석유 기반 합성소재를 
        천연 대안으로 대체합니다. 울, 나무, 사탕수수 같은 자연 소재는 
        부드럽고 통기성이 좋습니다.`,
        img: "/extra3.webp",
      },
    ],
    []
  );

  return (
    <Wrap>
      <Inner>
        <Grid>
          {items.map((it) => (
            <Card key={it.id}>
              <Thumb>
                <Img src={it.img} alt={it.title} />
              </Thumb>

              <Text>
                <Title>{it.title}</Title>
                <Desc>{it.desc}</Desc>
              </Text>
            </Card>
          ))}
        </Grid>
      </Inner>
    </Wrap>
  );
}

/* ===== styles ===== */

const Wrap = styled.section`
  width: 100%;
  background: #f3f3f3;
`;

const Inner = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: 20px 18px 60px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
`;

const Card = styled.div``;

const Thumb = styled.div`
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: #eee;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  transform: scale(1);
  transition: transform 420ms ease;

  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

/* 텍스트 영역 */
const Text = styled.div`
  margin-top: 22px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.4px;
  color: #333;
`;

const Desc = styled.p`
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.75;
  color: #666;
  white-space: pre-line;
`;
