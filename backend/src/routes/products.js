// src/routes/products.js
const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Review = require("../models/Review");

const router = express.Router();

// ✅ 카테고리별 상품 조회
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const normalized = String(category).trim().toUpperCase();

    const products = await Product.find({ categories: normalized })
      .sort({ createdAt: -1 })
      .lean();

    res.json(products);
  } catch (err) {
    console.error("GET /api/products/category/:category error:", err);
    res.status(500).json({ message: "카테고리별 상품 조회 실패" });
  }
});

// 전체 상품 목록 (필터링 지원)
router.get("/", async (req, res) => {
  try {
    const { category, size, material } = req.query;
    const filter = {};

    // 카테고리 필터
    if (category) {
      const now = new Date();

      if (category === "new") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filter.createdAt = { $gte: oneMonthAgo };
      } else if (category === "sale") {
        filter.discountRate = { $gt: 0 };
        filter.saleStart = { $lte: now };
        filter.saleEnd = { $gte: now };
      } else {
        filter.categories = String(category).trim().toUpperCase();
      }
    }

    // ✅ 사이즈 필터 (virtual 말고 sizes 서브도큐먼트로)
    // size=270,275,280
    if (size) {
      const sizes = String(size)
        .split(",")
        .map((v) => Number(v))
        .filter((n) => !Number.isNaN(n));

      if (sizes.length > 0) {
        filter.sizes = {
          $elemMatch: {
            size: { $in: sizes },
            stock: { $gt: 0 },
          },
        };
      }
    }

    // 소재 필터
    // material=울,트리
    if (material) {
      const materials = String(material)
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);

      if (materials.length > 0) {
        filter.materials = { $in: materials };
      }
    }

    const products = await Product.find(filter).lean();
    res.json(products);
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({ message: "상품 목록 조회 실패" });
  }
});

// 인기 상품
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

// 단일 상품 + 리뷰
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

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
