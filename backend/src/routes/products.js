// src/routes/products.js
const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Review = require("../models/Review");

const router = express.Router();

// ✅ 카테고리별 상품 조회
// GET /api/products/category/SLIPON
// GET /api/products/category/LIFESTYLE
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;

    // 저장된 값이 대문자("SLIPON")라면 통일해서 검색
    const normalized = String(category).trim().toUpperCase();

    const products = await Product.find({
      categories: normalized // 배열에 포함되면 매칭됨
    })
      .sort({ createdAt: -1 }) // 최신순(원하면 변경)
      .lean();

    res.json(products);
  } catch (err) {
    console.error("GET /api/products/category/:category error:", err);
    res.status(500).json({ message: "카테고리별 상품 조회 실패" });
  }
});

// ✅ 특정 사이즈 '구매 가능(stock>0)' 상품 조회
// GET /api/products/available-size/260
router.get("/available-size/:size", async (req, res) => {
  try {
    const size = Number(req.params.size);
    if (Number.isNaN(size)) {
      return res.status(400).json({ message: "사이즈는 숫자여야 합니다." });
    }

    const products = await Product.find({
      sizes: { $elemMatch: { size, stock: { $gt: 0 } } },
    })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    res.json(products);
  } catch (err) {
    console.error("GET /api/products/available-size/:size error:", err);
    res.status(500).json({ message: "사이즈별 상품 조회 실패" });
  }
});

// 전체 상품 목록
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json(products);
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({ message: "상품 목록 조회 실패" });
  }
});

// 인기 상품 (예: salesCount 기준 상위 8개)
router.get("/popular", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ salesCount: -1 })
      .limit(8)
      .lean({ virtuals: true }); // ✅

    res.json(products);
  } catch (err) {
    console.error("GET /api/products/popular error:", err);
    res.status(500).json({ message: "인기 상품 조회 실패" });
  }
});


// ✅ 단일 상품의 사이즈 정보만
// GET /api/products/:id/sizes
router.get("/:id/sizes", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "잘못된 상품 ID 형식입니다." });
    }

    const product = await Product.findById(id)
      .select("allSizes sizes")
      .lean({ virtuals: true }); // ✅ availableSizes도 같이 나감

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    res.json({
      allSizes: product.allSizes || [],
      sizes: product.sizes || [],
      availableSizes: product.availableSizes || [],
    });
  } catch (err) {
    console.error("GET /api/products/:id/sizes error:", err);
    res.status(500).json({ message: "사이즈 정보 조회 실패" });
  }
});

// 단일 상품 + 리뷰 (항상 마지막에 두기)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ObjectId 형식 검증
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "잘못된 상품 ID 형식입니다." });
    }

    const product = await Product.findById(id).lean({ virtuals: true });
    if (!product) {
      return res
        .status(404)
        .json({ message: "상품을 찾을 수 없습니다." });
    }

    const reviews = await Review.find({ product: product._id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ product, reviews });
  } catch (err) {
    console.error("GET /api/products/:id error:", err);
    res.status(500).json({ message: "상품 조회 실패" });
  }
});

module.exports = router;
