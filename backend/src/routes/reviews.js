// src/routes/reviews.js
const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Review = require("../models/Review");
const Order = require("../models/Order");
const router = express.Router();

/**
 * ✅ 특정 상품 리뷰 조회
 * GET /api/reviews/product/:productId
 */
router.get("/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId })
            .populate("user", "name")
            .sort({ createdAt: -1 })
            .lean();

        res.json(reviews);
    } catch (err) {
        console.error("GET /api/reviews/product/:productId error:", err);
        res.status(500).json({ message: "상품 리뷰 조회 실패" });
    }
});

// 후기 작성 (해당 제품을 실제 구매한 사용자만 허용하는 식으로 예시)
router.post("/write", requireAuth, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({ message: "필수 값이 누락되었습니다." });
        }

        // 간단 구매 여부 체크 (주문내역에 해당 productId가 있는지)
        const hasPurchased = await Order.exists({
            user: req.session.user.id,
            "items.product": productId
        });

        if (!hasPurchased) {
            return res.status(400).json({ message: "구매한 상품만 후기 작성이 가능합니다." });
        }

        const review = await Review.create({
            product: productId,
            user: req.session.user.id,
            rating,
            comment
        });

        const populated = await Review.findById(review._id)
            .populate("user", "name")
            .lean();

        res.json(populated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "후기 작성 실패" });
    }
});

module.exports = router;
