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

// 전체 상품 목록
router.get("/", async (req, res) => {
  try {
    const { category, size, material } = req.query;

    // 필터 조건 빌드
    const filter = {};

    // 카테고리 필터
    if (category) {
      const now = new Date();

      if (category === "new") {
        // 신제품: 1달 이내 등록
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filter.createdAt = { $gte: oneMonthAgo };
      } else if (category === "sale") {
        // 세일: 할인율 > 0 이고 세일 기간 내
        filter.discountRate = { $gt: 0 };
        filter.saleStart = { $lte: now };
        filter.saleEnd = { $gte: now };
      } else {
        // LIFESTYLE, SLIPON 등
        filter.categories = category;
      }
    }

    // 사이즈 필터 (여러 개 선택 가능: size=270,275,280)
    if (size) {
      const sizes = size.split(",").map(Number);
      filter.availableSizes = { $in: sizes };
    }

    // 소재 필터 (여러 개 선택 가능: material=울,트리)
    if (material) {
      const materials = material.split(",");
      filter.materials = { $in: materials };
    }

    const products = await Product.find(filter).lean();
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
      .lean();

    res.json(products);
  } catch (err) {
    console.error("GET /api/products/popular error:", err);
    res.status(500).json({ message: "인기 상품 조회 실패" });
  }
});

// 단일 상품 + 리뷰 (항상 마지막에 두기)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ObjectId 형식 검증
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "잘못된 상품 ID 형식입니다." });
    }

    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
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
