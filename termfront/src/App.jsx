// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />

        {/* TODO: 나중에 페이지 생기면 추가 */}
        {/* <Route path="/products/:id" element={<ProductDetailPage />} /> */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
