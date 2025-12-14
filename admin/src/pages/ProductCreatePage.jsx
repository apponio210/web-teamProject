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
  const [shortDesc, setShortDesc] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categories, setCategories] = useState(""); // "LIFESTYLE,SLIPON"
  const [gender, setGender] = useState("공용");
  const [materials, setMaterials] = useState(""); // "울,트리"

  // ===== 가용사이즈(상세페이지와 동일한 UI) =====
  const [selectedSizes, setSelectedSizes] = useState([]);

  // ===== 할인정책(상세페이지와 동일한 UI) =====
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

  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      const has = prev.includes(size);
      const next = has ? prev.filter((s) => s !== size) : [...prev, size];
      next.sort((a, b) => a - b);
      return next;
    });
  };

  const onPickFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;

    // 최대 10장 제한
    setFiles((prev) => {
      const merged = [...prev, ...picked].slice(0, 10);
      return merged;
    });

    // 같은 파일 다시 선택 가능하게
    e.target.value = "";
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async () => {
    setMsg("");

    // 간단 검증
    if (!name.trim()) return setMsg("❌ 상품명은 필수입니다.");
    if (!basePrice || Number(basePrice) <= 0)
      return setMsg("❌ 가격(basePrice)은 0보다 커야 합니다.");
    if (files.length === 0)
      return setMsg("❌ 이미지는 최소 1장 업로드해야 합니다.");

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("name", name.trim());
      if (shortDesc.trim()) fd.append("shortDesc", shortDesc.trim());

      fd.append("basePrice", String(Number(basePrice)));

      // swagger가 string(csv)로 받는 형태
      if (categories.trim()) fd.append("categories", normalizeCsv(categories));
      if (materials.trim()) fd.append("materials", normalizeCsv(materials));

      if (gender.trim()) fd.append("gender", gender);

      // 가용사이즈: "250,255,260"
      if (selectedSizes.length > 0) {
        fd.append("availableSizes", selectedSizes.join(","));
      }

      // 할인정책
      fd.append("discountRate", String(Number(discountRate || 0)));
      if (saleStart) fd.append("saleStart", saleStart);
      if (saleEnd) fd.append("saleEnd", saleEnd);

      // images (field name: images)
      files.forEach((f) => fd.append("images", f));

      const created = await createProduct(fd);

      setMsg("✅ 등록 완료!");
      // 등록 후 상세로 이동하거나 목록으로 이동 (원하는 UX로)
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

        {/* 우측: 가용사이즈 + 할인정책 (상세페이지와 동일 틀) */}
        <Right>
          <Panel>
            <PanelTitle>가용 사이즈</PanelTitle>
            <HelpText>클릭해서 선택/해제 </HelpText>

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

const SizeBtn = styled.button`
  height: 46px;
  border-radius: 0px;
  border: 1px solid ${(p) => (p.$active ? "#111" : "#ddd")};
  background: #fff;
  color: #333;
  font-weight: ${(p) => (p.$active ? 900 : 500)};
  cursor: pointer;

  ${(p) => p.$active && `box-shadow: inset 0 0 0 1px #111;`}

  &:hover {
    border-color: #111;
  }
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
