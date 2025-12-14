import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchProducts } from "../api/products";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [thumbIdxMap, setThumbIdxMap] = useState({});

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (!alive) return;

        const list = Array.isArray(data) ? data : [];
        setItems(list);

        const init = {};
        list.forEach((p) => (init[p._id] = 0));
        setThumbIdxMap(init);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const onPickThumb = (id, idx) => {
    setThumbIdxMap((prev) => ({ ...prev, [id]: idx }));
  };

  return (
    <Wrap>
      <Top>
        <Title>상품관리</Title>
        <Right>
          <RefreshBtn
            type="button"
            onClick={() => window.location.reload()}
            title="새로고침"
          >
            새로고침
          </RefreshBtn>
          <PrimaryBtn type="button" onClick={() => nav("/products/new")}>
            + 상품 등록
          </PrimaryBtn>
        </Right>
      </Top>

      {loading ? (
        <StateText>불러오는 중...</StateText>
      ) : items.length === 0 ? (
        <StateText>상품이 없습니다.</StateText>
      ) : (
        <Grid>
          {items.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              thumbIndex={thumbIdxMap[p._id] ?? 0}
              onPickThumb={onPickThumb}
            />
          ))}
        </Grid>
      )}
    </Wrap>
  );
}

/** ===== styles ===== */
const Wrap = styled.div`
  display: grid;
  gap: 16px;
`;

const Top = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
`;

const Right = styled.div`
  display: flex;
  gap: 8px;
`;

const RefreshBtn = styled.button`
  height: 36px;
  padding: 0 12px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    border-color: #bbb;
  }
`;

const PrimaryBtn = styled.button`
  height: 36px;
  padding: 0 12px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StateText = styled.div`
  color: #666;
  padding: 12px 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(240px, 1fr));
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(240px, 1fr));
  }
  @media (max-width: 740px) {
    grid-template-columns: 1fr;
  }
`;
