import styled from "styled-components";
import QuantitySelector from "./QuantitySelector";

const Container = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid #e5e5e5;
`;

const ImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  background: #f5f5f5;

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
  font-size: 14px;
  font-weight: 500;
  color: #212121;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const Option = styled.span`
  font-size: 13px;
  color: #666;
  margin-bottom: 2px;
`;

const Price = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #212121;
  margin-top: auto;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #999;

  &:hover {
    color: #212121;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const product = item.product || {};
  const formatPrice = (value) => `₩${value?.toLocaleString()}`;

  return (
    <Container>
      <ImageWrapper>
        <img src={product.images?.[0] || product.image} alt={product.name} />
      </ImageWrapper>
      <Info>
        <Name>{product.name}</Name>
        <Option>{product.color || "내추럴 화이트"}</Option>
        <Option>{item.size}</Option>
        <Price>{formatPrice(product.price)}</Price>
      </Info>
      <Actions>
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
        <QuantitySelector
          quantity={item.quantity}
          onChange={(q) => onQuantityChange(item, q)}
        />
      </Actions>
    </Container>
  );
};

export default CartItem;
