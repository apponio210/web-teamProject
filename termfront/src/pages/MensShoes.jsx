import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import BottomBanner from "../component/BottomBanner";
import { getProducts, transformProducts } from "../api/product";

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  margin-bottom: 20px;
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
  border: 1px solid #212121;
  width: fit-content;
  margin-bottom: 30px;
`;

const GenderButton = styled.button`
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.$active ? "#212121" : "#fff")};
  color: ${(props) => (props.$active ? "#fff" : "#212121")};

  &:hover {
    background: ${(props) => (props.$active ? "#212121" : "#f5f5f5")};
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 20px;
`;

const CategoryTab = styled.button`
  padding: 14px 24px;
  font-size: 15px;
  border: ${(props) => (props.$active ? "1px solid #212121" : "none")};
  background: #fff;
  color: #212121;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    text-decoration: ${(props) => (props.$active ? "none" : "underline")};
  }
`;

const CloseIcon = styled.span`
  font-size: 18px;
  line-height: 1;
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
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 40px;
  font-weight: 700;
  color: #212121;
  margin: 0 0 20px 0;
`;

const PageDescription = styled.p`
  font-size: 18px;
  color: #212121;
  line-height: 1.7;
  max-width: 100%;
  margin: 0;
  font-weight: 400;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e5e5;
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
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #212121;

  &:hover {
    background: #f5f5f5;
  }
`;

const SortMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #e5e5e5;
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
  width: 16px;
  height: 16px;
  border: 1px solid ${(props) => (props.$active ? "#212121" : "#ccc")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    width: 8px;
    height: 8px;
    background: ${(props) => (props.$active ? "#212121" : "transparent")};
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
    { key: "all", label: "신발" },
    { key: "new", label: "신제품" },
    { key: "LIFESTYLE", label: "라이프스타일" },
    { key: "active", label: "액티브" },
    { key: "sale", label: "세일" },
    { key: "SLIPON", label: "슬립온" },
  ];

  const sortOptions = [
    { key: "recommended", label: "추천순" },
    { key: "sales", label: "판매순" },
    { key: "priceLow", label: "가격 낮은 순" },
    { key: "priceHigh", label: "가격 높은 순" },
    { key: "newest", label: "최신 등록 순" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(transformProducts(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 필터링 + 정렬 적용
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 카테고리 필터링
    if (activeCategory && activeCategory !== "all") {
      if (activeCategory === "new") {
        // 신제품: 등록일 기준 1달 이내
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        result = result.filter((p) => new Date(p.createdAt) >= oneMonthAgo);
      } else if (activeCategory === "sale") {
        // 세일: 할인율 > 0
        result = result.filter((p) => p.originalPrice !== null);
      } else {
        // LIFESTYLE, SLIPON 등
        result = result.filter((p) => p.categories?.includes(activeCategory));
      }
    }

    // 사이즈 필터링 (OR)
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        filters.sizes.some((size) => p.availableSizes?.includes(parseInt(size)))
      );
    }

    // 소재 필터링 (OR)
    if (filters.materials.length > 0) {
      result = result.filter((p) =>
        filters.materials.some((material) => {
          const materialMap = {
            "부드럽고 따뜻한 Wool": "울",
            "가볍고 시원한 Tree": "트리",
          };
          const mappedMaterial = materialMap[material] || material;
          return p.materials?.includes(mappedMaterial);
        })
      );
    }

    // 정렬
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
        // 기본 순서 유지
        break;
    }

    return result;
  }, [products, activeCategory, filters, sortBy]);

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

  const currentSortLabel = sortOptions.find((o) => o.key === sortBy)?.label;

  return (
    <PageWrapper>
      <Breadcrumb>
        <BreadcrumbLink href="#">
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
        {categories.map((category) => (
          <CategoryTab
            key={category.key}
            $active={activeCategory === category.key}
            onClick={() => handleCategoryClick(category.key)}
          >
            {category.label}
            {activeCategory === category.key && <CloseIcon>×</CloseIcon>}
          </CategoryTab>
        ))}
      </CategoryTabs>

      <Divider />

      <PageContent>
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        <MainContent>
          <ContentHeader>
            <ProductCount>
              {filteredAndSortedProducts.length}개 제품
            </ProductCount>
            <SortDropdown>
              <SortButton onClick={() => setSortOpen(!sortOpen)}>
                {currentSortLabel}
                <span>▼</span>
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
          <ProductGrid products={filteredAndSortedProducts} />
        </MainContent>
      </PageContent>
      <BottomBanner />
    </PageWrapper>
  );
};

export default MensShoes;
