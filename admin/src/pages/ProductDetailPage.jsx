import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { api } from "../api/client";
import { patchProductDiscount, patchProductSizes } from "../api/products";

export default function ProductDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ sizes form
  const [selectedSizes, setSelectedSizes] = useState([]); // [230,240,250]
  const [savingSizes, setSavingSizes] = useState(false);
  const [sizesMsg, setSizesMsg] = useState("");

  // ✅ discount form
  const [discountRate, setDiscountRate] = useState(0);
  const [saleStart, setSaleStart] = useState(""); // YYYY-MM-DD
  const [saleEnd, setSaleEnd] = useState(""); // YYYY-MM-DD
  const [savingDiscount, setSavingDiscount] = useState(false);
  const [discountMsg, setDiscountMsg] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        // ✅ 1) 상세조회 API가 있으면 이걸 추천
        // const res = await api.get(`/api/products/${id}`);

        // ✅ 2) 없다면 전체조회에서 찾아오기(현재 가장 안전)
        const res = await api.get(`/api/products`);
        const found = (Array.isArray(res.data) ? res.data : []).find(
          (p) => p._id === id
        );

        if (!alive) return;
        setProduct(found || null);

        // 폼 초기값
        if (found) {
          setSelectedSizes(found.availableSizes || []);
          setDiscountRate(Number(found.discountRate || 0));
          setSaleStart(toDateInput(found.saleStart));
          setSaleEnd(toDateInput(found.saleEnd));
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    const bp = Number(product.basePrice || 0);
    const rate = Number(discountRate || 0);
    return Math.round(bp * (1 - rate / 100));
  }, [product, discountRate]);

  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      const has = prev.includes(size);
      const next = has ? prev.filter((s) => s !== size) : [...prev, size];
      next.sort((a, b) => a - b);
      return next;
    });
  };

  const onSaveSizes = async () => {
    setSizesMsg("");
    try {
      setSavingSizes(true);

      const csv = selectedSizes.join(","); // "230,240,250"
      await patchProductSizes(id, csv);

      setSizesMsg("✅ 가용 사이즈가 저장되었습니다.");

      // 화면 반영용(이미 selectedSizes가 있으니 없어도 되지만)
      setProduct((prev) =>
        prev ? { ...prev, availableSizes: selectedSizes } : prev
      );
    } catch (err) {
      console.log(err);
      setSizesMsg("❌ 저장 실패");
    } finally {
      setSavingSizes(false);
    }
  };

  const onSaveDiscount = async () => {
    setDiscountMsg("");
    try {
      setSavingDiscount(true);

      // 서버가 null도 허용한다고 했으니 비어있으면 null로
      const payload = {
        discountRate: Number(discountRate || 0),
        saleStart: saleStart ? saleStart : null,
        saleEnd: saleEnd ? saleEnd : null,
      };

      await patchProductDiscount(id, payload);
      setDiscountMsg("✅ 할인 정책이 저장되었습니다.");

      // 화면 반영용(선택)
      setProduct((prev) => (prev ? { ...prev, ...payload } : prev));
    } catch (err) {
      console.log(err);
      setDiscountMsg("❌ 저장 실패");
    } finally {
      setSavingDiscount(false);
    }
  };

  if (loading) return <Wrap>불러오는 중...</Wrap>;
  if (!product) return <Wrap>상품을 찾을 수 없습니다.</Wrap>;

  return (
    <Wrap>
      <Top>
        <BackBtn type="button" onClick={() => nav("/products")}>
          ← 목록
        </BackBtn>
        <Title>{product.name}</Title>
      </Top>

      <Layout>
        <Left>
          <ImgBox>
            <img
              src={toImgUrl(product.images?.[0])}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </ImgBox>

          <Meta>
            <div>
              <b>ID</b> {product._id}
            </div>
            <div>
              <b>성별</b> {product.gender}
            </div>
            <div>
              <b>카테고리</b> {(product.categories || []).join(", ")}
            </div>
            <div>
              <b>소재</b> {(product.materials || []).join(", ")}
            </div>
            <div>
              <b>기본가</b> ₩{Number(product.basePrice).toLocaleString("ko-KR")}
            </div>
            <div>
              <b>할인가(미리보기)</b> ₩
              {Number(finalPrice).toLocaleString("ko-KR")}
            </div>
          </Meta>

          {product.shortDesc && <Desc>{product.shortDesc}</Desc>}
        </Left>

        <Right>
          {/* ✅ 1) 가용 사이즈 */}
          <Panel>
            <PanelTitle>가용 사이즈 변경</PanelTitle>
            <HelpText>클릭해서 선택/해제 후 저장</HelpText>

            <SizeGrid>
              {ALL_SIZES.map((size) => {
                const active = selectedSizes.includes(size);
                return (
                  <SizeBtn
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    $active={active}
                  >
                    {size}
                  </SizeBtn>
                );
              })}
            </SizeGrid>

            <Row>
              <SaveBtn
                type="button"
                onClick={onSaveSizes}
                disabled={savingSizes}
              >
                {savingSizes ? "저장 중..." : "사이즈 저장"}
              </SaveBtn>
              {sizesMsg && <Msg>{sizesMsg}</Msg>}
            </Row>
          </Panel>

          {/* ✅ 2) 할인 정책 */}
          <Panel>
            <PanelTitle>할인 정책 변경</PanelTitle>

            <Grid2>
              <Field>
                <Label>시작일</Label>
                <Input
                  type="date"
                  value={saleStart}
                  onChange={(e) => setSaleStart(e.target.value)}
                />
              </Field>

              <Field>
                <Label>종료일</Label>
                <Input
                  type="date"
                  value={saleEnd}
                  onChange={(e) => setSaleEnd(e.target.value)}
                />
              </Field>

              <Field>
                <Label>할인율(%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                />
              </Field>
            </Grid2>

            <Row>
              <SaveBtn
                type="button"
                onClick={onSaveDiscount}
                disabled={savingDiscount}
              >
                {savingDiscount ? "저장 중..." : "할인 저장"}
              </SaveBtn>
              {discountMsg && <Msg>{discountMsg}</Msg>}
            </Row>
          </Panel>
        </Right>
      </Layout>
    </Wrap>
  );
}

/** ===== helpers ===== */
function toImgUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  return `${base}${path}`;
}
function toDateInput(iso) {
  if (!iso) return "";
  // "2025-12-01T..." -> "2025-12-01"
  return String(iso).slice(0, 10);
}
const ALL_SIZES = [
  220, 230, 240, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305,
  310, 315, 320,
];

/** ===== styles ===== */
const Wrap = styled.div`
  display: grid;
  gap: 14px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackBtn = styled.button`
  height: 34px;
  padding: 0 12px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    border-color: #bbb;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div`
  display: grid;
  gap: 12px;
`;

const Right = styled.div`
  display: grid;
  gap: 12px;
`;

const ImgBox = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 1 / 1;
`;

const Meta = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 12px;
  display: grid;
  gap: 6px;
  color: #333;
  font-size: 13px;
`;

const Desc = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 12px;
  color: #555;
  line-height: 1.5;
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
  font-weight: 900;
  font-size: 15px;
`;

const HelpText = styled.div`
  color: #777;
  font-size: 14px;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const Field = styled.div`
  display: grid;
  gap: 7px;
`;

const Label = styled.div`
  font-size: 12px;
  color: #666;
  font-weight: 700;
`;

const Input = styled.input`
  height: 42px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0 12px;
  outline: none;

  &:focus {
    border-color: #111;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SaveBtn = styled.button`
  height: 38px;
  padding: 0 12px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const SizeBtn = styled.button`
  height: 46px;
  border-radius: 0px;
  border: 1px solid ${(p) => (p.$active ? "#111" : "#ddd")};
  background: #fff;
  color: ${(p) => (p.$active ? "#111" : "#333")};
  font-weight: ${(p) => (p.$active ? 900 : 500)};
  cursor: pointer;

  ${(p) =>
    p.$active &&
    `
    box-shadow: inset 0 0 0 1px #111;
  `}

  &:hover {
    border-color: #111;
  }
`;

const Msg = styled.div`
  font-size: 12px;
  color: #444;
`;
