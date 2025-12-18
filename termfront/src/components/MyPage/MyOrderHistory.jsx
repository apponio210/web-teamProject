import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchMyOrders } from "../../api/orders";

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function formatMoney(n) {
  const num = Number(n || 0);
  return num.toLocaleString("ko-KR");
}

export default function MyOrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const data = await fetchMyOrders();
        if (!alive) return;
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.log(e);
        if (!alive) return;
        setErrorMsg("주문 내역을 불러오지 못했어요.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...orders].sort((a, b) => {
      const ta = new Date(a?.paidAt || 0).getTime();
      const tb = new Date(b?.paidAt || 0).getTime();
      return tb - ta;
    });
  }, [orders]);

  const handleWriteReview = (productId) => {
    navigate(`/review/write?productId=${productId}`);
  };

  return (
    <Wrap>
      <HeadRow>
        <Title>지난 주문 내역</Title>
        <Sub>구매 완료 상품에 대해 리뷰를 작성할 수 있어요.</Sub>
      </HeadRow>

      {loading && <Info>불러오는 중...</Info>}
      {!loading && errorMsg && <Error>{errorMsg}</Error>}
      {!loading && !errorMsg && sorted.length === 0 && (
        <Info>아직 주문 내역이 없어요.</Info>
      )}

      <List>
        {sorted.map((order) => (
          <OrderCard key={order?._id}>
            <OrderTop>
              <OrderMeta>
                <OrderDate>{formatDate(order?.paidAt)}</OrderDate>
                <OrderId>주문번호: {order?._id}</OrderId>
              </OrderMeta>

              <OrderTotal>
                합계 <b>{formatMoney(order?.totalAmount)}원</b>
              </OrderTotal>
            </OrderTop>

            <Divider />

            <Items>
              {(order?.items || []).map((it, idx) => (
                <ItemRow key={`${order?._id}-${idx}`}>
                  <Thumb aria-hidden="true" />

                  <ItemInfo>
                    <ItemName>{it?.nameSnapshot || "상품"}</ItemName>
                    <ItemOption>
                      사이즈 {it?.size} · 수량 {it?.quantity} · 단가{" "}
                      {formatMoney(it?.unitPrice)}원
                    </ItemOption>
                  </ItemInfo>

                  <RightCol>
                    <LineTotal>{formatMoney(it?.lineTotal)}원</LineTotal>
                    <ReviewBtn
                      type="button"
                      onClick={() => handleWriteReview(it.product)}
                    >
                      리뷰 작성
                    </ReviewBtn>
                  </RightCol>
                </ItemRow>
              ))}
            </Items>
          </OrderCard>
        ))}
      </List>
    </Wrap>
  );
}

const Wrap = styled.div`
  padding-right: 20px;
`;

const HeadRow = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 34px;
  font-weight: 800;
`;

const Sub = styled.div`
  color: #666;
  font-size: 14px;
`;

const List = styled.div`
  display: grid;
  gap: 18px;
`;

const OrderCard = styled.div`
  background: #fffcfcff;
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
`;

const OrderTop = styled.div`
  padding: 18px 18px 14px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const OrderMeta = styled.div``;

const OrderDate = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const OrderId = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #777;
`;

const OrderTotal = styled.div`
  font-size: 14px;
  color: #444;

  b {
    font-size: 16px;
    color: #111;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
`;

const Items = styled.div`
  display: grid;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 14px;
  padding: 16px 18px;
  border-top: 1px solid #f0f0f0;

  &:first-child {
    border-top: none;
  }

  @media (max-width: 720px) {
    grid-template-columns: 64px 1fr;
    grid-template-rows: auto auto;
  }
`;

const Thumb = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  background: #f3f3f3;
`;

const ItemInfo = styled.div`
  min-width: 0;
`;

const ItemName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemOption = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #666;
`;

const RightCol = styled.div`
  display: grid;
  justify-items: end;
  gap: 10px;
  align-content: start;

  @media (max-width: 720px) {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const LineTotal = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const ReviewBtn = styled.button`
  height: 34px;
  padding: 0 12px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;

  &:hover {
    background: #000;
    border-color: #000;
  }
`;

const Info = styled.div`
  padding: 30px 0;
  color: #666;
`;

const Error = styled.div`
  padding: 14px 0;
  color: #d32f2f;
  font-size: 14px;
`;
