const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Review = require("../models/Review");
const Order = require("../models/Order");
const router = express.Router();

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

router.post("/write", requireAuth, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ message: "필수 값이 누락되었습니다." });
    }

    const hasPurchased = await Order.exists({
      user: req.session.user.id,
      "items.product": productId,
    });

    if (!hasPurchased) {
      return res
        .status(400)
        .json({ message: "구매한 상품만 후기 작성이 가능합니다." });
    }

    const review = await Review.create({
      product: productId,
      user: req.session.user.id,
      rating,
      title,
      comment,
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
