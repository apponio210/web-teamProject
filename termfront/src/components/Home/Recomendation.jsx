// src/components/Recommendation/Recommendation.jsx
import React, { useMemo } from "react";
import styled from "styled-components";

export default function Recommendation() {
  const items = useMemo(
    () => [
      {
        id: 1,
        title: "Wool Runner NZ",
        desc: "오리지널 메리노 울 슈즈",
        img: "/recommend1.webp",
      },
      {
        id: 2,
        title: "Wool Cruiser Waterproof",
        desc: "완벽 방수로 24시간 보송하게",
        img: "/recommend2.webp",
      },
      {
        id: 3,
        title: "Wool Cruiser Slip-on",
        desc: "신고 벗기 편한 슬립온",
        img: "/recommend3.webp",
      },
    ],
    []
  );

  return (
    <Wrap>
      <Inner>
        <Title>추천 제품</Title>

        <Grid>
          {items.map((it) => (
            <Card key={it.id}>
              <Thumb>
                <Img src={it.img} alt={it.title} />
              </Thumb>

              {/* ✅ 2번 이미지처럼: 이미지 아래가 연한 회색 박스 */}
              <CardBody>
                <Name>{it.title}</Name>
                <Desc>{it.desc}</Desc>

                <Btns>
                  <Btn type="button">남성</Btn>
                  <Btn type="button">여성</Btn>
                </Btns>
              </CardBody>
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
  max-width: 1360px;
  margin: 0 auto;
  background: #f3f3f3;
  padding: 10px 18px 0px;
`;

const Inner = styled.div``;

const Title = styled.h2`
  margin: 0 0 30px 0;
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.8px;
  color: #111;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 34px;
`;

const Card = styled.div`
  border-radius: 14px;
  overflow: hidden;
  background: #fff;

  &:hover img {
    transform: scale(1.1);
  }
`;

const Thumb = styled.div`
  height: 400px;
  background: #2a2a2a;
  overflow: hidden;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1);
  transition: transform 420ms ease;
`;

const CardBody = styled.div`
  background: #fff;
  padding: 26px 0 28px;
  text-align: center;
`;

const Name = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #111;
`;

const Desc = styled.div`
  margin-top: 20px;
  font-size: 13px;
  color: #777;
`;

const Btns = styled.div`
  margin-top: 50px;
  display: grid;
  gap: 12px;
  padding: 0 34px;
`;

const Btn = styled.button`
  height: 44px;
  width: 100%;
  border: 1px solid #111;
  background: transparent;
  color: #111;
  font-size: 13px;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;

  &:hover {
    background: #111; /* ✅ hover 배경 검정 */
    color: #fff; /* ✅ hover 글씨 흰색 */
    border-color: #111;
  }
`;
