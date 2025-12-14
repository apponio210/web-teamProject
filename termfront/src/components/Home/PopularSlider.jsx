import React, { useMemo, useState } from "react";
import styled from "styled-components";

export default function PopularSlider() {
  const items = useMemo(
    () => [
      {
        rank: 1,
        name: "여성 울 러너 미즐",
        desc: "스포티 클래식 (내추럴화이트)",
        price: 98000,
        oldPrice: 129000,
        img: "/popular1.avif",
        sizes: [240, 245],
      },
      {
        rank: 2,
        name: "남성 울 러너 미즐",
        desc: "스포티 클래식 (내추럴화이트)",
        price: 98000,
        oldPrice: 129000,
        img: "/popular2.avif",
        sizes: [260, 265, 270, 275, 280],
      },
      {
        rank: 3,
        name: "여성 울 러너 고 플랫폼",
        desc: "내추럴화이트 (내추럴화이트)",
        price: 78000,
        oldPrice: 129000,
        img: "/popular3.avif",
        sizes: [235, 240, 245, 250, 255],
      },
      {
        rank: 4,
        name: "남성 트리 러너",
        desc: "젠틀 블랙 (블랙)",
        price: 78000,
        oldPrice: 150000,
        img: "/popular4.avif",
        sizes: [260, 270, 280, 290, 300],
      },
      {
        rank: 5,
        name: "남성 울 러너 NZ",
        desc: "나눔 블랙 (내추럴블랙)",
        price: 119000,
        oldPrice: 179000,
        img: "/popular5.avif",
        sizes: [260, 265, 270, 275, 280],
      },
      {
        rank: 6,
        name: "여성 트리 대셔",
        desc: "라이트 그레이 (그레이)",
        price: 109000,
        oldPrice: 149000,
        img: "/popular6.avif",
        sizes: [230, 235, 240, 245, 250],
      },
      {
        rank: 7,
        name: "남성 울 러너",
        desc: "스톤 (오프화이트)",
        price: 99000,
        oldPrice: 139000,
        img: "/popular7.avif",
        sizes: [255, 260, 265, 270, 275],
      },
      {
        rank: 8,
        name: "여성 트리 루운저",
        desc: "샌드 (베이지)",
        price: 89000,
        oldPrice: 129000,
        img: "/popular8.avif",
        sizes: [230, 235, 240, 245, 250],
      },
    ],
    []
  );

  const VISIBLE = 5;

  const [start, setStart] = useState(0);

  const maxStart = items.length - VISIBLE; // 8-5=3 (0~3까지만 가능)
  const canPrev = start > 0;
  const canNext = start < maxStart;

  const onPrev = () => {
    if (!canPrev) return;
    setStart((s) => s - 1);
  };

  const onNext = () => {
    if (!canNext) return;
    setStart((s) => s + 1);
  };

  const visibleItems = items.slice(start, start + VISIBLE);

  return (
    <Wrap>
      <HeaderRow>
        <Title>실시간 인기</Title>
      </HeaderRow>

      <Frame>
        <NavBtnLeft onClick={onPrev} disabled={!canPrev} aria-label="prev">
          ‹
        </NavBtnLeft>

        <List>
          {visibleItems.map((it) => (
            <Card key={it.rank}>
              <RankBadge>{it.rank}</RankBadge>

              <Thumb>
                <Img src={it.img} alt={it.name} />
              </Thumb>

              <Info>
                <Name>{it.name}</Name>
                <Desc>{it.desc}</Desc>

                <PriceRow>
                  <Price>{formatKRW(it.price)}</Price>
                  {it.oldPrice ? <Old>{formatKRW(it.oldPrice)}</Old> : null}
                </PriceRow>

                <SizeTitle>주문 가능 사이즈</SizeTitle>
                <SizeRow>
                  {it.sizes.map((s) => (
                    <SizeChip key={s}>{s}</SizeChip>
                  ))}
                </SizeRow>
              </Info>
            </Card>
          ))}
        </List>

        <NavBtnRight onClick={onNext} disabled={!canNext} aria-label="next">
          ›
        </NavBtnRight>
      </Frame>
    </Wrap>
  );
}

function formatKRW(n) {
  // 98,000원 형태
  return `₩${Number(n).toLocaleString("ko-KR")}`;
}

/* ===== styles ===== */

const Wrap = styled.section`
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 10px 18px 10px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -0.6px;
  padding: 0px 0px 10px 0px;
`;

const Frame = styled.div`
  position: relative;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const RankBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #111;
  color: #fff;
  font-size: 13px;
  display: grid;
  place-items: center;
  z-index: 2;
`;

const Thumb = styled.div`
  background: #f2f2f2;
  height: 250px;
  display: grid;
  place-items: center;
  overflow: hidden;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;

  transition: transform 280ms ease;

  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

const Info = styled.div`
  padding: 18px 16px 20px;
`;

const Name = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #111;
`;

const Desc = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: #666;
`;

const PriceRow = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Price = styled.div`
  font-size: 12px;
  font-weight: 800;
`;

const Old = styled.div`
  font-size: 10.5px;
  color: #9a9a9a;
  text-decoration: line-through;
`;

const SizeTitle = styled.div`
  margin-top: 10px;
  font-size: 10px;
  color: #777;
`;

const SizeRow = styled.div`
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SizeChip = styled.div`
  font-size: 10px;
  padding: 4px 6px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: #fafafa;
  color: #333;
`;

/* 버튼: 끝이면 disabled */
const NavBtn = styled.button`
  position: absolute;
  top: 125px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid #e8e8e8;
  background: rgba(255, 255, 255, 0.9);
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 20px;
  color: #111;
  user-select: none;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const NavBtnLeft = styled(NavBtn)`
  left: -16px;
  z-index: 100;
`;

const NavBtnRight = styled(NavBtn)`
  right: -16px;
`;
