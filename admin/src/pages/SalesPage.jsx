import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { fetchSales } from "../api/sales";

export default function SalesPage() {
  const [start, setStart] = useState(""); // "2025-12-01"
  const [end, setEnd] = useState(""); // "2025-12-31"
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const totals = useMemo(() => {
    const totalQty = rows.reduce(
      (acc, r) => acc + (r.quantity ?? r.salesCount ?? 0),
      0
    );
    const totalRevenue = rows.reduce(
      (acc, r) => acc + Number(r.revenue ?? 0),
      0
    );
    return { totalQty, totalRevenue };
  }, [rows]);

  const onSearch = async () => {
    setMsg("");

    // ✅ 간단 유효성
    if (start && end && start > end) {
      setMsg("❌ 시작일이 종료일보다 늦을 수 없습니다.");
      return;
    }

    try {
      setLoading(true);
      const data = await fetchSales({ start, end });

      // API 응답 키가 다를 수 있어서 안전 정리
      const normalized = (Array.isArray(data) ? data : []).map((x) => ({
        productId: x.productId || x.product || x._id,
        name: x.name || x.productName || x.nameSnapshot || "상품",
        quantity: x.quantity ?? x.salesCount ?? x.count ?? 0,
        revenue: Number(x.revenue ?? x.totalRevenue ?? 0),
      }));

      setRows(normalized);
      if (normalized.length === 0) setMsg("조회 결과가 없습니다.");
    } catch (e) {
      console.error(e);
      setMsg("❌ 조회 실패 (콘솔/네트워크 확인)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrap>
      <TopRow>
        <Title>판매 현황</Title>

        <FilterBar>
          <Field>
            <Label>시작일</Label>
            <Input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </Field>

          <Field>
            <Label>종료일</Label>
            <Input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </Field>

          <SearchBtn type="button" onClick={onSearch} disabled={loading}>
            {loading ? "조회 중..." : "조회"}
          </SearchBtn>
        </FilterBar>
      </TopRow>

      <Summary>
        <SumCard>
          <SumLabel>총 판매수량</SumLabel>
          <SumValue>{totals.totalQty.toLocaleString("ko-KR")}개</SumValue>
        </SumCard>

        <SumCard>
          <SumLabel>총 매출(할인 적용)</SumLabel>
          <SumValue>₩{totals.totalRevenue.toLocaleString("ko-KR")}</SumValue>
        </SumCard>
      </Summary>

      <Panel>
        <PanelTitle>제품별 판매/매출</PanelTitle>

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: "60px" }}>#</Th>
                <Th>상품명</Th>
                <Th style={{ width: "140px" }}>판매수량</Th>
                <Th style={{ width: "180px" }}>매출(₩)</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={`${r.productId}-${idx}`}>
                  <Td>{idx + 1}</Td>
                  <Td>
                    <Name>{r.name}</Name>
                    {r.productId && <SubId>{r.productId}</SubId>}
                  </Td>
                  <Td>{Number(r.quantity).toLocaleString("ko-KR")}</Td>
                  <Td>₩{Number(r.revenue).toLocaleString("ko-KR")}</Td>
                </tr>
              ))}
            </tbody>
          </Table>

          {rows.length === 0 && <Empty>조회 결과가 없습니다.</Empty>}
        </TableWrap>

        {msg && <Msg>{msg}</Msg>}
      </Panel>
    </Wrap>
  );
}

/** styles */
const Wrap = styled.div`
  display: grid;
  gap: 14px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 860px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
`;

const Label = styled.div`
  font-size: 12px;
  color: #666;
  font-weight: 800;
`;

const Input = styled.input`
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0 12px;
  outline: none;
  &:focus {
    border-color: #111;
  }
`;

const SearchBtn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Summary = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const SumCard = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 6px;
`;

const SumLabel = styled.div`
  font-size: 12px;
  color: #777;
  font-weight: 800;
`;

const SumValue = styled.div`
  font-size: 20px;
  font-weight: 1000;
`;

const Panel = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 10px;
`;

const PanelTitle = styled.div`
  font-weight: 1000;
  font-size: 15px;
`;

const TableWrap = styled.div`
  position: relative;
  overflow: auto;
  border: 1px solid #eee;
  border-radius: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;

  thead tr {
    background: #fafafa;
  }

  th,
  td {
    padding: 12px 10px;
    border-bottom: 1px solid #eee;
    text-align: left;
    vertical-align: top;
  }
`;

const Th = styled.th`
  font-size: 12px;
  color: #666;
  font-weight: 1000;
`;

const Td = styled.td`
  font-size: 13px;
  color: #333;
`;

const Name = styled.div`
  font-weight: 900;
`;

const SubId = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: #888;
`;

const Empty = styled.div`
  padding: 16px;
  color: #777;
`;

const Msg = styled.div`
  font-size: 12px;
  color: #444;
`;
