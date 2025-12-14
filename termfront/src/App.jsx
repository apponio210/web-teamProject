import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyle from "./style/GlobalStyle";
import MensShoes from "./pages/MensShoes";
import ProductDetailPage from "./pages/ProductDetailPage";
import RootLayout from "./layouts/RootLayout";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
