import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import { getProducts, transformProducts } from "../api/product";
import Extra from "../components/Home/Extra";

// 컴포넌트 밖으로 이동 (경고 해결)
const MATERIAL_MAP = {
  "부드럽고 따뜻한 Wool": "울",
  "가볍고 시원한 Tree": "트리",
};

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
`;

const BreadcrumbLink = styled.a`
  color: #666;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: #999;
`;

const GenderToggle = styled.div`
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  width: fit-content;
  margin-bottom: 40px;
`;

const GenderButton = styled.button`
  padding: 14px 36px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.$active ? "#212121" : "#e8e8e8")};
  color: ${(props) => (props.$active ? "#fff" : "#212121")};

  &:hover {
    background: ${(props) => (props.$active ? "#212121" : "#d5d5d5")};
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const ProductTypeWrapper = styled.div`
  display: flex;
  align-items: stretch;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #ffffffff;
`;

const ProductTypeSpace = styled.div`
  width: 16px;
`;

const ProductTypeTab = styled.button`
  padding: 14px 20px;
  font-size: 15px;
  border: 1px solid #212121;
  border-radius: 4px;
  background: #fff;
  color: #212121;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  margin: -1px -1px -1px 0;
`;

const CategoryTab = styled.button`
  padding: 14px 8px;
  font-size: 15px;
  border: none;
  background: transparent;
  color: ${(props) => (props.$active ? "#212121" : "#666")};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: ${(props) => (props.$active ? "underline" : "none")};
  text-underline-offset: 4px;

  &:hover {
    color: #212121;
  }
`;

const CloseIcon = styled.span`
  font-size: 18px;
  line-height: 1;
  color: #666;
`;

const PageWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 30px 50px;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 40px;
`;

const PageTitle = styled.h1`
  font-size: 56px;
  font-weight: 700;
  color: #212121;
  margin: 0 0 24px 0;
  letter-spacing: -1px;
`;

const PageDescription = styled.p`
  font-size: 20px;
  color: #212121;
  line-height: 1.6;
  max-width: 100%;
  margin: 0;
  font-weight: 400;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #000000ff;
  margin: 20px 0 30px 0;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductCount = styled.span`
  font-size: 14px;
  color: #666;
`;

const SortDropdown = styled.div`
  position: relative;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid #212121;
  background: ${(props) => (props.$open ? "#212121" : "#fff")};
  color: ${(props) => (props.$open ? "#fff" : "#212121")};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$open ? "#212121" : "#f5f5f5")};
  }
`;

const SortIcon = styled.svg`
  width: 16px;
  height: 16px;
`;

const SortMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #212121;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 150px;
  display: ${(props) => (props.$open ? "block" : "none")};
`;

const SortOption = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: ${(props) => (props.$active ? "#f5f5f5" : "#fff")};
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #212121;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f5f5f5;
  }
`;

const RadioCircle = styled.span`
  width: 20px;
  height: 20px;
  border: 2px solid #212121;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.$active ? "#212121" : "#fff")};

  &::after {
    content: "";
    width: 8px;
    height: 8px;
    background: ${(props) => (props.$active ? "#fff" : "transparent")};
    border-radius: 50%;
  }
`;

const PageContent = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  padding: 40px;
`;

const ErrorText = styled.p`
  font-size: 16px;
  color: #c41e3a;
  text-align: center;
  padding: 40px;
`;

const MensShoes = () => {
  const [activeGender, setActiveGender] = useState("men");
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [filters, setFilters] = useState({
    sizes: [],
    materials: [],
    features: [],
    models: [],
  });

  const categories = [
    { key: "new", label: "신제품" },
    { key: "LIFESTYLE", label: "라이프스타일" },
    { key: "active", label: "액티브", disabled: true },
    { key: "sale", label: "세일" },
    { key: "SLIPON", label: "슬립온" },
    { key: "SLIPPER", label: "슬리퍼", disabled: true },
  ];

  const sortOptions = [
    { key: "recommended", label: "추천순" },
    { key: "sales", label: "판매순" },
    { key: "priceLow", label: "가격 낮은 순" },
    { key: "priceHigh", label: "가격 높은 순" },
    { key: "newest", label: "최신 등록 순" },
  ];

  // 필터 변경 시 API 호출 (백엔드 필터링)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // API 파라미터 빌드
        const params = {};

        // 카테고리 (new, LIFESTYLE, sale, SLIPON만 필터링)
        if (
          activeCategory &&
          ["new", "LIFESTYLE", "sale", "SLIPON"].includes(activeCategory)
        ) {
          params.category = activeCategory;
        }

        // 사이즈
        if (filters.sizes.length > 0) {
          params.size = filters.sizes.join(",");
        }

        // 소재 (프론트 이름 → API 값 변환)
        if (filters.materials.length > 0) {
          const mappedMaterials = filters.materials.map(
            (m) => MATERIAL_MAP[m] || m
          );
          params.material = mappedMaterials.join(",");
        }

        const data = await getProducts(params);
        console.log("서버 원본 응답:", data);
        const transformed = transformProducts(data);

        // 👇 변환 후 데이터도 확인
        console.log("변환된 데이터:", transformed);
        setProducts(transformProducts(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, filters]);

  // 정렬만 프론트에서 처리
  const sortedProducts = useMemo(() => {
    const result = [...products];

    switch (sortBy) {
      case "sales":
        result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      case "priceLow":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "recommended":
      default:
        break;
    }

    return result;
  }, [products, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(activeCategory === categoryKey ? "" : categoryKey);
  };

  const handleSortSelect = (sortKey) => {
    setSortBy(sortKey);
    setSortOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({ sizes: [], materials: [], features: [], models: [] });
    setActiveCategory("");
  };

  if (loading) {
    return (
      <PageWrapper>
        <LoadingText>로딩 중...</LoadingText>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <ErrorText>에러: {error}</ErrorText>
      </PageWrapper>
    );
  }

  // ============ JSX 전부 그대로 유지 ============
  return (
    <PageWrapper>
      <Breadcrumb>
        <BreadcrumbLink href="/">
          <span>🏠</span> Home
        </BreadcrumbLink>
        <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
        <span>남성 전체 제품</span>
      </Breadcrumb>

      <GenderToggle>
        <GenderButton
          $active={activeGender === "men"}
          onClick={() => setActiveGender("men")}
        >
          남성
        </GenderButton>
        <GenderButton
          $active={activeGender === "women"}
          onClick={() => setActiveGender("women")}
        >
          여성
        </GenderButton>
      </GenderToggle>

      <PageHeader>
        <PageTitle>남성 신발</PageTitle>
        <PageDescription>
          Wool, Tree, Sugar 등 자연 소재로 만들어 놀랍도록 편안한 올버즈 제품을
          만나보세요. 우리는 편안한 신발의 기준을 만들어가고 있습니다.
        </PageDescription>
      </PageHeader>

      <CategoryTabs>
        <ProductTypeWrapper>
          <ProductTypeSpace />
          <ProductTypeTab>
            신발
            <CloseIcon>×</CloseIcon>
          </ProductTypeTab>
        </ProductTypeWrapper>
        {categories.map((category) => (
          <CategoryTab
            key={category.key}
            $active={activeCategory === category.key}
            disabled={category.disabled}
            onClick={() => handleCategoryClick(category.key)}
          >
            {category.label}
          </CategoryTab>
        ))}
      </CategoryTabs>

      <Divider />

      <PageContent>
        {/* ✅ products 전달 추가 (수정된 부분) */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          products={products}
        />
        <MainContent>
          <ContentHeader>
            <ProductCount>{sortedProducts.length}개 제품</ProductCount>
            <SortDropdown>
              <SortButton
                $open={sortOpen}
                onClick={() => setSortOpen(!sortOpen)}
              >
                <SortIcon
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="14" y2="12" />
                  <line x1="4" y1="18" x2="9" y2="18" />
                </SortIcon>
              </SortButton>
              <SortMenu $open={sortOpen}>
                {sortOptions.map((option) => (
                  <SortOption
                    key={option.key}
                    $active={sortBy === option.key}
                    onClick={() => handleSortSelect(option.key)}
                  >
                    <RadioCircle $active={sortBy === option.key} />
                    {option.label}
                  </SortOption>
                ))}
              </SortMenu>
            </SortDropdown>
          </ContentHeader>
          <ProductGrid products={sortedProducts} />
        </MainContent>
      </PageContent>
      <Extra />
    </PageWrapper>
  );
};

export default MensShoes;
