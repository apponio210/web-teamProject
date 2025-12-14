import React from "react";
import styled from "styled-components";

const Sidebar = styled.aside`
  width: 220px;
  padding-right: 40px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    padding-right: 0;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
`;

const AppliedFiltersSection = styled.div`
  margin-bottom: 30px;
`;

const AppliedFiltersTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #212121;
  margin: 0 0 16px 0;
`;

const AppliedFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const FilterTag = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #212121;
  background: #fff;
  font-size: 13px;
  color: #212121;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: #212121;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #666;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 40px;
`;

const FilterTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #212121;
  margin: 0 0 20px 0;
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const SizeBtn = styled.button`
  padding: 14px 8px;
  border: 1px solid ${(props) => (props.$active ? "#212121" : "#d0d0d0")};
  background: ${(props) => (props.$active ? "#212121" : "#fff")};
  color: ${(props) => (props.$active ? "#fff" : "#212121")};
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: #212121;
  }
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 16px;
  color: #212121;

  input {
    display: none;
  }
`;

const Checkbox = styled.span`
  width: 22px;
  height: 22px;
  border: 1px solid black;
  border-radius: 4px;
  background: ${(props) => (props.$checked ? "#212121" : "#fff")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &::after {
    content: "${(props) => (props.$checked ? "✓" : "")}";
    color: white;
    font-size: 14px;
  }

  &:hover {
    border-color: #212121;
  }
`;

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const sizes = [
    "220",
    "230",
    "240",
    "250",
    "255",
    "260",
    "265",
    "270",
    "275",
    "280",
    "285",
    "290",
    "295",
    "300",
    "305",
    "310",
    "315",
    "320",
  ];

  // 소재 (필터링 기능 있음)
  const materials = ["가볍고 시원한 Tree", "부드럽고 따뜻한 Wool"];

  // 기능 (렌더링만, 필터링 기능 없음)
  const features = [
    "비즈니스",
    "캐주얼",
    "가벼운 산책",
    "러닝",
    "발수",
    "슬립온",
    "슬리퍼",
    "클래식 스니커즈",
    "라이프스타일",
    "강한 접지력",
    "트레일러닝",
    "등산",
    "애슬레저",
  ];

  // 모델 (렌더링만, 필터링 기능 없음)
  const models = [
    "대셔",
    "라운저",
    "러너",
    "스키퍼",
    "크루저",
    "트레일",
    "파이퍼",
    "플라이어",
  ];

  const handleSizeClick = (size) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleMaterialClick = (material) => {
    const newMaterials = filters.materials.includes(material)
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material];
    onFilterChange({ ...filters, materials: newMaterials });
  };

  const removeFilter = (type, value) => {
    onFilterChange({
      ...filters,
      [type]: filters[type].filter((v) => v !== value),
    });
  };

  const hasFilters = filters.sizes.length > 0 || filters.materials.length > 0;

  return (
    <Sidebar>
      {hasFilters && (
        <AppliedFiltersSection>
          <AppliedFiltersTitle>적용된 필터</AppliedFiltersTitle>
          <AppliedFilters>
            {filters.sizes.map((size) => (
              <FilterTag key={size} onClick={() => removeFilter("sizes", size)}>
                {size} ×
              </FilterTag>
            ))}
            {filters.materials.map((material) => (
              <FilterTag
                key={material}
                onClick={() => removeFilter("materials", material)}
              >
                {material} ×
              </FilterTag>
            ))}
          </AppliedFilters>
          <ResetButton onClick={onReset}>초기화</ResetButton>
        </AppliedFiltersSection>
      )}

      <FilterSection>
        <FilterTitle>사이즈</FilterTitle>
        <SizeGrid>
          {sizes.map((size) => (
            <SizeBtn
              key={size}
              $active={filters.sizes.includes(size)}
              onClick={() => handleSizeClick(size)}
            >
              {size}
            </SizeBtn>
          ))}
        </SizeGrid>
      </FilterSection>

      <FilterSection>
        <FilterTitle>소재</FilterTitle>
        <CheckboxList>
          {materials.map((material) => (
            <CheckboxLabel key={material}>
              <input
                type="checkbox"
                checked={filters.materials.includes(material)}
                onChange={() => handleMaterialClick(material)}
              />
              <Checkbox $checked={filters.materials.includes(material)} />
              {material}
            </CheckboxLabel>
          ))}
        </CheckboxList>
      </FilterSection>

      <FilterSection>
        <FilterTitle>기능</FilterTitle>
        <CheckboxList>
          {features.map((feature) => (
            <CheckboxLabel key={feature}>
              <input type="checkbox" disabled />
              <Checkbox $checked={false} />
              {feature}
            </CheckboxLabel>
          ))}
        </CheckboxList>
      </FilterSection>

      <FilterSection>
        <FilterTitle>모델</FilterTitle>
        <CheckboxList>
          {models.map((model) => (
            <CheckboxLabel key={model}>
              <input type="checkbox" disabled />
              <Checkbox $checked={false} />
              {model}
            </CheckboxLabel>
          ))}
        </CheckboxList>
      </FilterSection>
    </Sidebar>
  );
};

export default FilterSidebar;
