// src/routes/orders.js
const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

// 결제(체크아웃)
router.post("/checkout", requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;

        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "장바구니가 비어 있습니다." });
        }

        // Cart 정보 기준으로 총액 계산
        const items = cart.items.map((item) => {
            // Product.getSalePrice()를 사용해서 다시 보정할 수도 있음
            const product = item.product;
            const salePrice =
                typeof product.getSalePrice === "function"
                    ? product.getSalePrice()
                    : product.basePrice;

            const unitPrice = salePrice;
            const lineTotal = salePrice * item.quantity;

            return {
                product: product._id,
                nameSnapshot: product.name,
                size: item.size,
                quantity: item.quantity,
                unitPrice,
                lineTotal
            };
        });

        const totalAmount = items.reduce((sum, it) => sum + it.lineTotal, 0);

        const order = await Order.create({
            user: userId,
            items,
            totalAmount,
            paidAt: new Date()
        });

        // 상품별 salesCount 증가
        for (const it of items) {
            await Product.findByIdAndUpdate(it.product, {
                $inc: { salesCount: it.quantity }
            });
        }

        // 장바구니 비우기
        cart.items = [];
        await cart.save();

        res.json(order);
    } catch (err) {
        console.error("POST /api/orders/checkout error:", err);
        res.status(500).json({ message: "결제 처리 실패" });
    }
});

// 내 주문 내역
router.get("/me", requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;

        const orders = await Order.find({ user: userId })
            .sort({ paidAt: -1 })
            .lean();

        res.json(orders);
    } catch (err) {
        console.error("GET /api/orders/me error:", err);
        res.status(500).json({ message: "주문 내역 조회 실패" });
    }
});

module.exports = router;
