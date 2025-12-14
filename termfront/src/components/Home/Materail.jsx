// src/components/Material/Material.jsx
import React, { useMemo } from "react";
import styled from "styled-components";

export default function Material() {
  const items = useMemo(
    () => [
      {
        id: 1,
        title: "ZQ 메리노 울",
        desc: "최상급 울 소재",
        img: "/mat3.avif",
      },
      {
        id: 2,
        title: "유칼립투스 나무",
        desc: "실크처럼 매끄러운 촉감",
        img: "/mat2.avif",
      },
      {
        id: 3,
        title: "사탕수수",
        desc: "부드러운 SweetFoam®의 주 소재",
        img: "/mat1.avif",
      },
    ],
    []
  );

  return (
    <Wrap>
      <Inner>
        <Title>우리가 사용하는 소재</Title>

        <Grid>
          {items.map((it) => (
            <Card key={it.id}>
              <Thumb>
                <Img src={it.img} alt={it.title} />
              </Thumb>

              <Body>
                <Name>{it.title}</Name>
                <Desc>{it.desc}</Desc>

                <MoreBtn>더 알아보기</MoreBtn>
              </Body>
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
  padding: 10px 0 100px;
`;

const Inner = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 18px;
`;

const Title = styled.h2`
  margin: 0 0 36px;
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -0.8px;
  color: #111;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
`;

const Thumb = styled.div`
  height: 433px;
  background: #eaeaea;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Body = styled.div`
  padding: 26px 26px 30px;
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #111;
`;

const Desc = styled.div`
  margin-top: 5px;
  font-size: 22px;
  color: #555;
`;

const MoreBtn = styled.button`
  margin-top: 40px;
  width: 100%;
  height: 50px;
  border: 1px solid #111;
  background: transparent;
  color: #111;
  font-size: 14px;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease;

  &:hover {
    background: #111;
    color: #fff;
  }
`;
