import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyle from "./style/GlobalStyle";
import MensShoes from "./pages/MensShoes";
import ProductDetailPage from "./pages/ProductDetailPage";
import RootLayout from "./layouts/RootLayout";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import { CartProvider } from "./context/CartProvider";
import CartSidebar from "./components/cart/CartSidebar";
import ReviewWritePage from "./pages/ReviewWritePage";

export default function App() {
  return (
    <CartProvider>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/menshoes" element={<MensShoes />} />
            <Route path="/menshoes/:id" element={<ProductDetailPage />} />
            <Route path="/review/write" element={<ReviewWritePage />} />
          </Route>
        </Routes>
        <CartSidebar />
      </BrowserRouter>
    </CartProvider>
  );
}
