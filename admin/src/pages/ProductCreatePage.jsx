import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createProduct } from "../api/products";

const ALL_SIZES = [
  220, 230, 240, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305,
  310, 315, 320,
];

export default function ProductCreatePage() {
  const nav = useNavigate();

  // ===== 기본정보 =====
  const [name, setName] = useState("");
  const [short, setShort] = useState(""); 
  const [shortDesc, setShortDesc] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categories, setCategories] = useState(""); // "LIFESTYLE,SLIPON"
  const [gender, setGender] = useState("공용");
  const [materials, setMaterials] = useState(""); // "울,트리"

  // ===== ✅ 사이즈/재고(백엔드 sizes에 맞춤) =====
  // sizes: [{ size: 250, stock: 10 }, ...]
  const [sizes, setSizes] = useState([]);
  const [bulkQty, setBulkQty] = useState("");

  // ===== 할인정책 =====
  const [discountRate, setDiscountRate] = useState(0);
  const [saleStart, setSaleStart] = useState("");
  const [saleEnd, setSaleEnd] = useState("");

  // ===== 이미지 업로드 =====
  const [files, setFiles] = useState([]); // File[]
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const finalPricePreview = useMemo(() => {
    const bp = Number(basePrice || 0);
    const rate = Number(discountRate || 0);
    return Math.round(bp * (1 - rate / 100));
  }, [basePrice, discountRate]);

  // ---------- sizes helpers ----------
  const hasSize = (size) => sizes.some((x) => x.size === size);

  const getStock = (size) => {
    const it = sizes.find((x) => x.size === size);
    return Number(it?.stock ?? 0);
  };

  const toggleSize = (size) => {
    setSizes((prev) => {
      const exists = prev.some((x) => x.size === size);
      if (exists) {
        return prev.filter((x) => x.size !== size);
      }
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

  const selectedSizes = useMemo(() => {
    return sizes.map((x) => x.size).sort((a, b) => a - b);
  }, [sizes]);

  // ---------- file handlers ----------
  const onPickFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;

    // 최대 10장 제한
    setFiles((prev) => [...prev, ...picked].slice(0, 10));

    // 같은 파일 다시 선택 가능하게
    e.target.value = "";
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // ---------- submit ----------
  const onSubmit = async () => {
    setMsg("");

    if (!name.trim()) return setMsg("❌ 상품명은 필수입니다.");
    if (!basePrice || Number(basePrice) <= 0)
      return setMsg("❌ 가격(basePrice)은 0보다 커야 합니다.");
    if (files.length === 0)
      return setMsg("❌ 이미지는 최소 1장 업로드해야 합니다.");
    if (sizes.length === 0)
      return setMsg("❌ 사이즈를 최소 1개 이상 선택해야 합니다.");

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("short", short.trim());
      if (shortDesc.trim()) fd.append("shortDesc", shortDesc.trim());

      fd.append("basePrice", String(Number(basePrice)));

      // swagger가 string(csv)로 받는 형태
      if (categories.trim()) fd.append("categories", normalizeCsv(categories));
      if (materials.trim()) fd.append("materials", normalizeCsv(materials));
      if (gender.trim()) fd.append("gender", gender);

      // ✅ 백엔드에 맞게: sizes = "250:10,260:0"
      const sizesStr = sizes
        .slice()
        .sort((a, b) => a.size - b.size)
        .map((x) => `${Number(x.size)}:${Number(x.stock ?? 0)}`)
        .join(",");
      fd.append("sizes", sizesStr);

      // ✅ allSizes는 선택이지만 보내면 명시적으로 저장됨: "250,260"
      const allSizesCsv = sizes
        .slice()
        .sort((a, b) => a.size - b.size)
        .map((x) => Number(x.size))
        .join(",");
      fd.append("allSizes", allSizesCsv);

      // ✅ availableSizes/sizeQty는 백엔드가 의미 있게 안 쓰므로 보내지 않음

      // 할인정책
      fd.append("discountRate", String(Number(discountRate || 0)));
      if (saleStart) fd.append("saleStart", saleStart);
      if (saleEnd) fd.append("saleEnd", saleEnd);

      // images (field name: images)
      files.forEach((f) => fd.append("images", f));

      const created = await createProduct(fd);

      setMsg("✅ 등록 완료!");
      nav(`/products/${created?._id || ""}`, { replace: true });
    } catch (e) {
      setMsg("❌ 등록 실패 (콘솔/네트워크 탭 확인)");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrap>
      <Top>
        <BackBtn type="button" onClick={() => nav("/products")}>
          ← 목록
        </BackBtn>
        <Title>상품 등록</Title>
      </Top>

      <Layout>
        {/* 좌측: 기본정보 + 이미지 */}
        <Left>
          <Panel>
            <PanelTitle>기본 정보</PanelTitle>

            <Field>
              <Label>상품명 *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>

            <Field>
              <Label>가격(basePrice) *</Label>
              <Input
                type="number"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
              />
            </Field>

            <Hint>
              할인가(미리보기):{" "}
              <b>₩{finalPricePreview.toLocaleString("ko-KR")}</b>
            </Hint>
            {/* ✅ 여기 추가 */}
            <Field>
              <Label>목록설명(short) *</Label>
              <Input
                value={short}
                onChange={(e) => setShort(e.target.value)}
                placeholder="목록 카드에 표시될 한 줄 설명"
              />
            </Field>
            <Field>
              <Label>설명(shortDesc)</Label>
              <Textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="짧은 설명을 입력하세요"
              />
            </Field>

            <Grid2>
              <Field>
                <Label>성별</Label>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                  <option value="공용">공용</option>
                </Select>
              </Field>

              <Field>
                <Label>카테고리(csv)</Label>
                <Input
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="LIFESTYLE,SLIPON"
                />
              </Field>

              <Field>
                <Label>소재(csv)</Label>
                <Input
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="울,트리"
                />
              </Field>
            </Grid2>
          </Panel>

          <Panel>
            <PanelTitle>상품 이미지 *</PanelTitle>
            <HelpText>최대 10장, field name은 images</HelpText>

            <FileRow>
              <FileInput
                type="file"
                multiple
                accept="image/*,.avif"
                onChange={onPickFiles}
              />
            </FileRow>

            {files.length > 0 && (
              <PreviewGrid>
                {files.map((f, idx) => {
                  const url = URL.createObjectURL(f);
                  return (
                    <PreviewItem key={f.name + idx}>
                      <PreviewImg src={url} alt="" />
                      <RemoveBtn type="button" onClick={() => removeFile(idx)}>
                        삭제
                      </RemoveBtn>
                    </PreviewItem>
                  );
                })}
              </PreviewGrid>
            )}
          </Panel>
        </Left>

        {/* 우측: ✅ 사이즈/재고 + 할인정책 */}
        <Right>
          <Panel>
            <PanelTitle>사이즈 / 재고</PanelTitle>
            <HelpText>사이즈 선택 후, 아래에서 재고를 입력하세요.</HelpText>

            <SizeGrid>
              {ALL_SIZES.map((size) => {
                const active = hasSize(size);
                const stock = active ? getStock(size) : 0;
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
                      <div className="qty">
                        {stock <= 0 ? "품절" : `재고 ${stock}`}
                      </div>
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
                  {selectedSizes.map((size) => (
                    <EditItem key={size}>
                      <span className="label">{size}</span>
                      <QtyInput
                        type="number"
                        min="0"
                        value={getStock(size)}
                        onChange={(e) => setStock(size, e.target.value)}
                      />
                      <span className="hint">
                        {getStock(size) <= 0 ? "품절" : "정상"}
                      </span>
                    </EditItem>
                  ))}
                </EditList>
              )}
            </EditBox>
          </Panel>

          <Panel>
            <PanelTitle>할인 정책</PanelTitle>

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
          </Panel>

          <FooterBar>
            <PrimaryBtn type="button" onClick={onSubmit} disabled={submitting}>
              {submitting ? "등록 중..." : "상품 등록"}
            </PrimaryBtn>
            {msg && <Msg>{msg}</Msg>}
          </FooterBar>
        </Right>
      </Layout>
    </Wrap>
  );
}

/** helpers */
function normalizeCsv(text) {
  return String(text || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(",");
}

function clampInt(v, min, max) {
  const n = Number(String(v ?? "").replace(/[^\d]/g, ""));
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

/** styles */
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
  grid-template-columns: 1.2fr 1fr;
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
  font-size: 12px;
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
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

const Textarea = styled.textarea`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  min-height: 88px;
  resize: vertical;
  &:focus {
    border-color: #111;
  }
`;

const Select = styled.select`
  height: 42px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0 12px;
  outline: none;
  &:focus {
    border-color: #111;
  }
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Hint = styled.div`
  font-size: 12px;
  color: #555;
`;

const FileRow = styled.div`
  display: flex;
  gap: 10px;
`;

const FileInput = styled.input``;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media (max-width: 700px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PreviewItem = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  display: grid;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const RemoveBtn = styled.button`
  height: 34px;
  border: none;
  background: #f3f3f3;
  cursor: pointer;
  font-weight: 800;

  &:hover {
    background: #eaeaea;
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

const FooterBar = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 10px;
`;

const PrimaryBtn = styled.button`
  height: 42px;
  border-radius: 12px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  cursor: pointer;
  font-weight: 900;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Msg = styled.div`
  font-size: 12px;
  color: #444;
`;
