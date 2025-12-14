import styled from "styled-components";
import { useCart } from "../../context/useCart";
import CartItem from "./CartItem";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${(props) => (props.$open ? 1 : 0)};
  visibility: ${(props) => (props.$open ? "visible" : "hidden")};
  transition: all 0.3s ease;
  z-index: 1000;
`;

const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  max-width: 100%;
  height: 100vh;
  background: #fff;
  transform: translateX(${(props) => (props.$open ? "0" : "100%")});
  transition: transform 0.3s ease;
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e5;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 24px;
  color: #212121;
  line-height: 1;

  &:hover {
    color: #666;
  }
`;

const CartIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 24px;
    height: 24px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

const PromoText = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  text-align: center;
`;

const ItemList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  font-size: 15px;
`;

const Footer = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #e5e5e5;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TotalLabel = styled.span`
  font-size: 15px;
  color: #212121;
`;

const TotalAmount = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #212121;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 18px;
  background: #212121;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #000;
  }
`;

const CartSidebar = () => {
  const {
    cartItems,
    isCartOpen,
    totalAmount,
    totalCount,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const formatPrice = (value) => `₩${value?.toLocaleString()}`;

  return (
    <>
      <Overlay $open={isCartOpen} onClick={closeCart} />
      <Panel $open={isCartOpen}>
        <Header>
          <HeaderTop>
            <CloseButton onClick={closeCart}>×</CloseButton>
            <CartIcon>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>{totalCount}</span>
            </CartIcon>
          </HeaderTop>
          <PromoText>
            회원가입 시 1만원 할인 쿠폰 증정 (마케팅 수신 동의 필수)
          </PromoText>
        </Header>

        <ItemList>
          {cartItems.length === 0 ? (
            <EmptyMessage>장바구니가 비어있습니다</EmptyMessage>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeFromCart}
              />
            ))
          )}
        </ItemList>

        <Footer>
          <TotalRow>
            <TotalLabel>총액</TotalLabel>
            <TotalAmount>{formatPrice(totalAmount)}</TotalAmount>
          </TotalRow>
          <CheckoutButton>결제</CheckoutButton>
        </Footer>
      </Panel>
    </>
  );
};

export default CartSidebar;
