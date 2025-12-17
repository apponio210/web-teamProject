import styled from "styled-components";
import QuantitySelector from "./QuantitySelector";
import { API_BASE_URL } from "../../api";

const Container = styled.div`
  padding: 20px 0;
  border-bottom: ${(props) => (props.$isLast ? "none" : "1px solid #e5e5e5")};
`;

const ContentRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

const ImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  background: #e4e0da;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-size: 15px;
  font-weight: 400;
  color: #212121;
  line-height: 1.4;
  margin-bottom: 8px;
`;

const Option = styled.span`
  font-size: 14px;
  color: #212121;
  margin-bottom: 2px;
`;

const Price = styled.span`
  font-size: 14px;
  color: #212121;
  margin-top: 2px;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #212121;

  &:hover {
    color: #666;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const CartItem = ({ item, onQuantityChange, onRemove, isLast }) => {
  const product = item.product || {};

  const formatPrice = (value) => {
    if (value === undefined || value === null) return "₩0";
    return `₩${value.toLocaleString()}`;
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  const imageUrl = getImageUrl(product.images?.[0]);
  const productName = product.name || "상품명 없음";
  const productColor = product.color || "";

  return (
    <Container $isLast={isLast}>
      <ContentRow>
        <ImageWrapper>
          {imageUrl ? (
            <img src={imageUrl} alt={productName} />
          ) : (
            <div
              style={{ width: "100%", height: "100%", background: "#e4e0da" }}
            />
          )}
        </ImageWrapper>
        <Info>
          <Name>{productName}</Name>
          {productColor && <Option>{productColor}</Option>}
          <Option>{item.size}</Option>
          <Price>{formatPrice(item.unitPrice)}</Price>
        </Info>
      </ContentRow>
      <BottomRow>
        <QuantitySelector
          quantity={item.quantity}
          onChange={(q) => onQuantityChange(item, q)}
        />
        <DeleteButton onClick={() => onRemove(item._id)}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </DeleteButton>
      </BottomRow>
    </Container>
  );
};

export default CartItem;
