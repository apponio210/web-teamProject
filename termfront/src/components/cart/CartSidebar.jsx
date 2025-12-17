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
  position: relative;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  position: absolute;
  left: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 32px;
  font-weight: 300;
  color: #212121;
  line-height: 1;

  &:hover {
    color: #666;
  }
`;

const CartIconWrapper = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

const CartIcon = styled.svg`
  width: 32px;
  height: 32px;
`;

const CartBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 2px;
  right: 0;
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  color: #212121;
`;

const ItemList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
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
  padding: 24px;
  border-top: 1px solid #e5e5e5;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 400;
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

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CartSidebar = () => {
  const {
    cartItems,
    isCartOpen,
    loading,
    totalAmount,
    totalCount,
    closeCart,
    updateQuantity,
    removeFromCart,
    checkout,
  } = useCart();

  const formatPrice = (value) => `₩${(value || 0).toLocaleString()}`;

  const handleCheckout = async () => {
    const order = await checkout();
    if (order) {
      alert(
        `결제가 완료되었습니다!\n주문번호: ${order._id}\n총액: ${formatPrice(
          order.totalAmount
        )}`
      );
    }
  };

  return (
    <>
      <Overlay $open={isCartOpen} onClick={closeCart} />
      <Panel $open={isCartOpen}>
        <Header>
          <CloseButton onClick={closeCart}>×</CloseButton>
          <CartIconWrapper>
            <CartIcon viewBox="0 0 24 24" fill="none">
              <path
                d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
                fill="#212121"
              />
              <path
                d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
                fill="#212121"
              />
              <path
                d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                stroke="#212121"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </CartIcon>
            {totalCount > 0 && <CartBadge>{totalCount}</CartBadge>}
          </CartIconWrapper>
        </Header>

        <ItemList>
          {cartItems.length === 0 ? (
            <EmptyMessage>장바구니가 비어있습니다</EmptyMessage>
          ) : (
            cartItems.map((item, index) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeFromCart}
                isLast={index === cartItems.length - 1}
              />
            ))
          )}
        </ItemList>

        <Footer>
          <TotalRow>
            <TotalLabel>총액</TotalLabel>
            <TotalAmount>{formatPrice(totalAmount)}</TotalAmount>
          </TotalRow>
          <CheckoutButton
            onClick={handleCheckout}
            disabled={loading || cartItems.length === 0}
          >
            {loading ? "처리중..." : "결제"}
          </CheckoutButton>
        </Footer>
      </Panel>
    </>
  );
};

export default CartSidebar;
