import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { api } from "../api/client";
import { patchProductDiscount } from "../api/products";

export default function ProductDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ short 저장용 state (누락된 부분)
  const [short, setShort] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
  
  // ✅ sizes(state는 sizes만 들고 간다): [{size:250, stock:10}, ...]
  const [sizes, setSizes] = useState([]);
  const [bulkQty, setBulkQty] = useState("");
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

        // 상세조회 API가 없어서 전체 조회에서 찾는 방식 유지
        const res = await api.get(`/api/products`);
        const found = (Array.isArray(res.data) ? res.data : []).find(
          (p) => p._id === id
        );

        if (!alive) return;

        setProduct(found || null);

        if (found) {
          setShort(String(found.short || ""));
          // ✅ sizes 초기화: 백엔드 의도({size,stock}) 우선, 없으면 availableSizes로 0 채움
          const init = normalizeSizesFromProduct(found);
          setSizes(init);

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

  // 선택된 사이즈 목록(오름차순)
  const selectedSizes = useMemo(() => {
    return sizes.map((x) => x.size).sort((a, b) => a - b);
  }, [sizes]);

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    const bp = Number(product.basePrice || 0);
    const rate = Number(discountRate || 0);
    return Math.round(bp * (1 - rate / 100));
  }, [product, discountRate]);

  // ---- sizes handlers ----
  const hasSize = (size) => sizes.some((x) => x.size === size);

  const toggleSize = (size) => {
    setSizes((prev) => {
      const exists = prev.some((x) => x.size === size);
      if (exists) {
        // 해제: 해당 size 삭제
        return prev.filter((x) => x.size !== size);
      }
      // 선택: 기본 stock 0으로 추가
      return [...prev, { size, stock: 0 }].sort((a, b) => a.size - b.size);
    });
  };

  const setStock = (size, value) => {
    const n = clampInt(value, 0, 999999);
    setSizes((prev) =>
      prev.map((x) => (x.size === size ? { ...x, stock: n } : x))
    );
  };

  const applyBulkQty = () => {
    const n = clampInt(bulkQty, 0, 999999);
    setSizes((prev) => prev.map((x) => ({ ...x, stock: n })));
  };

  const markSoldOut = () => {
    setSizes((prev) => prev.map((x) => ({ ...x, stock: 0 })));
  };

  const onSaveSizes = async () => {
    setSizesMsg("");
    try {
      setSavingSizes(true);

      // ✅ 백엔드 parseSizes가 받는 형태 1) "250:10,260:0"
      const sizesStr = sizes
        .slice()
        .sort((a, b) => a.size - b.size)
        .map((x) => `${x.size}:${Number(x.stock || 0)}`)
        .join(",");

      // allSizes는 선택이지만, 보내면 명시적으로 저장 가능
      const allSizesCsv = sizes
        .slice()
        .sort((a, b) => a.size - b.size)
        .map((x) => x.size)
        .join(",");

      // ✅ 관리자 백엔드 라우트에 맞춤
      const updated = await api.patch(`/api/admin/products/${id}/sizes`, {
        sizes: sizesStr,
        allSizes: allSizesCsv,
      });

      setSizesMsg("✅ 사이즈/재고가 저장되었습니다.");

      // 화면 반영
      setProduct((prev) => (prev ? { ...prev, ...(updated.data || {}) } : prev));
    } catch (err) {
      console.log(err);
      setSizesMsg("❌ 저장 실패");
    } finally {
      setSavingSizes(false);
    }
  };

  // ---- discount handlers (기존 유지) ----
  const onSaveDiscount = async () => {
    setDiscountMsg("");
    try {
      setSavingDiscount(true);

      const payload = {
        discountRate: Number(discountRate || 0),
        saleStart: saleStart ? saleStart : null,
        saleEnd: saleEnd ? saleEnd : null,
      };

      await patchProductDiscount(id, payload);
      setDiscountMsg("✅ 할인 정책이 저장되었습니다.");
      setProduct((prev) => (prev ? { ...prev, ...payload } : prev));
    } catch (err) {
      console.log(err);
      setDiscountMsg("❌ 저장 실패");
    } finally {
      setSavingDiscount(false);
    }
  };
  
  const onSaveShort = async () => {
    setInfoMsg("");
    if (!short.trim()) return setInfoMsg("❌ 목록설명(short)은 비울 수 없습니다.");

    try {
      setSavingInfo(true);

      const updated = await api.patch(`/api/admin/products/${id}/short`, {
        short: short.trim(),
      });

      setInfoMsg("✅ 목록설명(short)이 저장되었습니다.");
      setProduct((prev) =>
        prev ? { ...prev, ...(updated.data || {}), short: short.trim() } : prev
      );
    } catch (err) {
      console.log(err);
      setInfoMsg("❌ 저장 실패 (백엔드 PATCH 라우트가 있는지 확인)");
    } finally {
      setSavingInfo(false);
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
              <b>할인가(미리보기)</b> ₩{Number(finalPrice).toLocaleString("ko-KR")}
            </div>
          </Meta>
          <Panel>
            <PanelTitle>목록설명(short)</PanelTitle>
            <HelpText>상품 목록 카드에 표시되는 한 줄 설명입니다. (필수)</HelpText>

            <Input
              value={short}
              onChange={(e) => setShort(e.target.value)}
              placeholder="예) 발이 편한 데일리 스니커즈"
            />

            <Row>
              <SaveBtn type="button" onClick={onSaveShort} disabled={savingInfo}>
                {savingInfo ? "저장 중..." : "목록설명 저장"}
              </SaveBtn>
              {infoMsg && <Msg>{infoMsg}</Msg>}
            </Row>
          </Panel>
          
          {product.shortDesc && <Desc>{product.shortDesc}</Desc>}
        </Left>

        <Right>
          {/* ✅ 1) 사이즈/재고 (백엔드 sizes에 맞춤) */}
          <Panel>
            <PanelTitle>사이즈 / 재고</PanelTitle>
            <HelpText>사이즈 선택 후, 아래에서 재고를 수정하고 저장하세요.</HelpText>

            <SizeGrid>
              {ALL_SIZES.map((size) => {
                const active = hasSize(size);
                const stock = active
                  ? Number(sizes.find((x) => x.size === size)?.stock ?? 0)
                  : 0;

                return (
                  <SizeTile
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    $active={active}
                    $soldout={active && stock <= 0}
                  >
                    <div className="size">{size}</div>
                    {active ? (
                      <div className="qty">{stock <= 0 ? "품절" : `재고 ${stock}`}</div>
                    ) : (
                      <div className="qty muted">미선택</div>
                    )}
                  </SizeTile>
                );
              })}
            </SizeGrid>

            <EditBox>
              <EditTop>
                <EditTitle>선택된 사이즈 재고</EditTitle>

                <BulkRow>
                  <BulkInput
                    type="number"
                    min="0"
                    placeholder="일괄 수량"
                    value={bulkQty}
                    onChange={(e) => setBulkQty(e.target.value)}
                  />
                  <MiniBtn type="button" onClick={applyBulkQty}>
                    일괄 적용
                  </MiniBtn>
                  <MiniBtn type="button" onClick={markSoldOut}>
                    전부 품절(0)
                  </MiniBtn>
                </BulkRow>
              </EditTop>

              {selectedSizes.length === 0 ? (
                <EmptyText>선택된 사이즈가 없습니다.</EmptyText>
              ) : (
                <EditList>
                  {selectedSizes.map((size) => {
                    const stock = Number(
                      sizes.find((x) => x.size === size)?.stock ?? 0
                    );
                    return (
                      <EditItem key={size}>
                        <span className="label">{size}</span>
                        <QtyInput
                          type="number"
                          min="0"
                          value={stock}
                          onChange={(e) => setStock(size, e.target.value)}
                        />
                        <span className="hint">{stock <= 0 ? "품절" : "정상"}</span>
                      </EditItem>
                    );
                  })}
                </EditList>
              )}
            </EditBox>

            <Row>
              <SaveBtn type="button" onClick={onSaveSizes} disabled={savingSizes}>
                {savingSizes ? "저장 중..." : "사이즈/재고 저장"}
              </SaveBtn>
              {sizesMsg && <Msg>{sizesMsg}</Msg>}
            </Row>
          </Panel>

          {/* ✅ 2) 할인 정책 (기존 유지) */}
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
function normalizeSizesFromProduct(p) {
  // 1) 백엔드 의도대로 sizes가 [{size, stock}]일 때
  if (Array.isArray(p?.sizes) && p.sizes.length > 0) {
    // 혹시 [{size:250, stock:10}] 형태가 아니라 [250,260] 같은 잘못된 형태면 걸러냄
    const objShape = p.sizes.every(
      (x) => x && typeof x === "object" && "size" in x
    );
    if (objShape) {
      return p.sizes
        .map((x) => ({
          size: Number(x.size),
          stock: Number(x.stock ?? 0),
        }))
        .filter((x) => Number.isFinite(x.size) && Number.isFinite(x.stock) && x.stock >= 0)
        .sort((a, b) => a.size - b.size);
    }

    // [250,260] 형태면 stock 0으로 보정
    const numShape = p.sizes.every((x) => Number.isFinite(Number(x)));
    if (numShape) {
      return p.sizes
        .map((s) => ({ size: Number(s), stock: 0 }))
        .sort((a, b) => a.size - b.size);
    }
  }

  // 2) availableSizes만 있으면 stock 0으로 채움
  if (Array.isArray(p?.availableSizes) && p.availableSizes.length > 0) {
    return p.availableSizes
      .map((s) => ({ size: Number(s), stock: 0 }))
      .filter((x) => Number.isFinite(x.size))
      .sort((a, b) => a.size - b.size);
  }

  return [];
}

function clampInt(v, min, max) {
  const n = Number(String(v ?? "").replace(/[^\d]/g, ""));
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function toImgUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  return `${base}${path}`;
}

function toDateInput(iso) {
  if (!iso) return "";
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

const SizeTile = styled.button`
  height: 56px;
  border-radius: 0px;
  border: 1px solid ${(p) => (p.$active ? "#111" : "#ddd")};
  background: #fff;
  cursor: pointer;
  display: grid;
  align-content: center;
  gap: 4px;
  padding: 6px 8px;

  ${(p) => p.$active && `box-shadow: inset 0 0 0 1px #111;`}
  ${(p) => p.$soldout && `opacity: 0.9;`}

  .size {
    font-weight: ${(p) => (p.$active ? 900 : 600)};
    color: #111;
    line-height: 1;
  }

  .qty {
    font-size: 12px;
    color: ${(p) => (p.$active ? "#444" : "#777")};
    line-height: 1;
  }

  .qty.muted {
    opacity: 0.8;
  }

  &:hover {
    border-color: #111;
  }
`;

const EditBox = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 10px;
`;

const EditTop = styled.div`
  display: grid;
  gap: 10px;
`;

const EditTitle = styled.div`
  font-weight: 900;
  font-size: 13px;
  color: #222;
`;

const BulkRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const BulkInput = styled.input`
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0 10px;
  width: 120px;
  outline: none;

  &:focus {
    border-color: #111;
  }
`;

const MiniBtn = styled.button`
  height: 36px;
  padding: 0 10px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;

  &:hover {
    border-color: #111;
  }
`;

const EditList = styled.div`
  display: grid;
  gap: 8px;
`;

const EditItem = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  gap: 10px;
  align-items: center;

  .label {
    font-weight: 900;
    color: #111;
  }

  .hint {
    font-size: 12px;
    color: #666;
    text-align: right;
  }
`;

const QtyInput = styled.input`
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0 10px;
  outline: none;

  &:focus {
    border-color: #111;
  }
`;

const EmptyText = styled.div`
  font-size: 13px;
  color: #777;
  padding: 6px 0;
`;

const Msg = styled.div`
  font-size: 12px;
  color: #444;
`;
