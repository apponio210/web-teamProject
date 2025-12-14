import { useState, useCallback, useEffect } from "react";
import { CartContext } from "./CartContext";
import {
  getCart,
  addToCart as addToCartAPI,
  updateCartItem,
  removeCartItem,
} from "../api/cart";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCartItems(data.items || []);
    } catch (error) {
      console.error("장바구니 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (product, size, quantity = 1) => {
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

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
