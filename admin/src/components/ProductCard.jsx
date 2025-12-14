import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function ProductCard({ product, thumbIndex = 0, onPickThumb }) {
  const nav = useNavigate();

  const images = product?.images || [];
  const mainImg = images[thumbIndex] || images[0];

  const hasDiscount = (product?.discountRate ?? 0) > 0;

  const finalPrice = useMemo(() => {
    const bp = Number(product?.basePrice || 0);
    const rate = Number(product?.discountRate || 0);
    return Math.round(bp * (1 - rate / 100));
  }, [product?.basePrice, product?.discountRate]);

  return (
    <Card>
      <ImgBox>
        {mainImg ? (
          <MainImg src={toImgUrl(mainImg)} alt={product?.name || "product"} />
        ) : (
          <ImgEmpty>NO IMAGE</ImgEmpty>
        )}
      </ImgBox>

      <ThumbRow>
        {images.slice(0, 4).map((src, i) => (
          <ThumbBtn
            key={src + i}
            type="button"
            onClick={() => onPickThumb(product._id, i)}
            $active={i === thumbIndex}
            aria-label={`thumbnail-${i}`}
          >
            <ThumbImg src={toImgUrl(src)} alt="" />
          </ThumbBtn>
        ))}
      </ThumbRow>

      <Info>
        <Name>{product?.name}</Name>

        {product?.shortDesc && <Desc>{product.shortDesc}</Desc>}

        <MetaRow>
          {product?.gender && <Pill>{product.gender}</Pill>}
          {(product?.categories || []).slice(0, 1).map((c) => (
            <Pill key={c}>{c}</Pill>
          ))}
          {(product?.materials || []).slice(0, 1).map((m) => (
            <Pill key={m}>{m}</Pill>
          ))}
        </MetaRow>

        <PriceRow>
          {hasDiscount && <Discount>{product.discountRate}%</Discount>}
          <FinalPrice>₩{formatNumber(finalPrice)}</FinalPrice>
          {hasDiscount && (
            <OriginPrice>₩{formatNumber(product.basePrice)}</OriginPrice>
          )}
        </PriceRow>

        <SubRow>
          <Small>사이즈: {(product?.availableSizes || []).join(", ")}</Small>
          <Small>판매수: {product?.salesCount ?? 0}</Small>
        </SubRow>

        <Actions>
          <GhostBtn
            type="button"
            onClick={() => nav(`/products/${product._id}`)}
          >
            제품상세
          </GhostBtn>
        </Actions>
      </Info>
    </Card>
  );
}

/** ===== helpers ===== */
function toImgUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = import.meta.env.VITE_API_BASE_URL;
  return `${base}${path}`;
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString("ko-KR");
}

/** ===== styles ===== */
const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  overflow: hidden;
  display: grid;
`;

const ImgBox = styled.div`
  background: #f3f3f3;
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
`;

const MainImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ImgEmpty = styled.div`
  color: #999;
  font-weight: 700;
`;

const ThumbRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 12px 0;
`;

const ThumbBtn = styled.button`
  width: 48px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$active ? "#111" : "#e6e6e6")};
  background: #fff;
  padding: 0;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border-color: #111;
  }
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Info = styled.div`
  padding: 14px 14px 16px;
  display: grid;
  gap: 10px;
`;

const Name = styled.div`
  font-weight: 800;
  font-size: 18px;
`;

const Desc = styled.div`
  color: #555;
  font-size: 13px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Pill = styled.span`
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f3f3f3;
  color: #333;
  font-weight: 700;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Discount = styled.span`
  color: #d11;
  font-weight: 900;
`;

const FinalPrice = styled.span`
  font-size: 18px;
  font-weight: 900;
`;

const OriginPrice = styled.span`
  color: #999;
  text-decoration: line-through;
  font-size: 13px;
`;

const SubRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Small = styled.span`
  color: #777;
  font-size: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const GhostBtn = styled.button`
  flex: 1;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-weight: 700;

  &:hover {
    border-color: #bbb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
