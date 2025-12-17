import { useState, useCallback, useEffect } from "react";
import { CartContext } from "./CartContext";
import {
  getCart,
  addToCart as addToCartAPI,
  updateCartItem,
  removeCartItem,
} from "../api/cart";
import { checkout as checkoutAPI } from "../api/orders";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("user");
    if (!token) return;

    try {
      setLoading(true);
      const data = await getCart();
      setCartItems(data.items || []);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("장바구니 조회 실패:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (product, size, quantity = 1) => {
    const token = localStorage.getItem("user");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const data = await addToCartAPI(product.id, size, quantity);
      setCartItems(data.items || []);
      setIsCartOpen(true);
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
    }
  }, []);

  const updateQuantity = useCallback(async (item, newQuantity) => {
    const productId = item.product?._id || item.product;
    try {
      const data = await updateCartItem(productId, item.size, newQuantity);
      setCartItems(data.items || []);
    } catch (error) {
      console.error("수량 변경 실패:", error);
    }
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      const data = await removeCartItem(itemId);
      setCartItems(data.items || []);
    } catch (error) {
      console.error("상품 삭제 실패:", error);
    }
  }, []);

  const checkout = useCallback(async () => {
    if (cartItems.length === 0) {
      alert("장바구니가 비어있습니다.");
      return null;
    }

    try {
      setLoading(true);
      const order = await checkoutAPI();
      setCartItems([]);
      setIsCartOpen(false);
      return order;
    } catch (error) {
      console.error("결제 실패:", error);
      alert("결제에 실패했습니다. 다시 시도해주세요.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [cartItems.length]);

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.lineTotal || 0);
  }, 0);

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        loading,
        totalAmount,
        totalCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        openCart,
        closeCart,
        fetchCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
