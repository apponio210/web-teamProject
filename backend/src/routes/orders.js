// src/routes/orders.js
const express = require("express");
const mongoose = require("mongoose");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

// 결제(체크아웃)
router.post("/checkout", requireAuth, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const userId = req.session.user.id;

        let createdOrder = null;

        await session.withTransaction(async () => {
            const cart = await Cart.findOne({ user: userId })
                .populate("items.product")
                .session(session);

            if (!cart || cart.items.length === 0) {
                throw new Error("EMPTY_CART");
            }

            // 1) 재고 검증 + 차감 (원자적으로)
            for (const item of cart.items) {
                const productId = item.product?._id;
                const size = Number(item.size);
                const qty = Number(item.quantity);

                if (!productId || Number.isNaN(size) || Number.isNaN(qty) || qty <= 0) {
                    throw new Error("INVALID_CART_ITEM");
                }

                // 해당 사이즈 재고가 qty 이상일 때만 차감
                const updated = await Product.findOneAndUpdate(
                    {
                        _id: productId,
                        sizes: { $elemMatch: { size, stock: { $gte: qty } } },
                    },
                    {
                        $inc: {
                            "sizes.$.stock": -qty, // ✅ 재고 차감
                            salesCount: qty,       // ✅ 판매량 증가
                        },
                    },
                    { new: true, session }
                );

                if (!updated) {
                    // 품절/재고부족/사이즈 없음
                    throw new Error("OUT_OF_STOCK");
                }
            }

            // 2) 주문 아이템 스냅샷 생성 + 총액 계산
            const items = cart.items.map((item) => {
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
                    lineTotal,
                };
            });

            const totalAmount = items.reduce((sum, it) => sum + it.lineTotal, 0);

            // 3) 주문 생성
            createdOrder = await Order.create(
                [
                    {
                        user: userId,
                        items,
                        totalAmount,
                        paidAt: new Date(),
                    },
                ],
                { session }
            );

            // 4) 장바구니 비우기
            cart.items = [];
            await cart.save({ session });
        });

        // create() 배열로 만들었으니 첫 번째 꺼
        res.json(createdOrder[0]);
    } catch (err) {
        console.error("POST /api/orders/checkout error:", err);

        if (err.message === "EMPTY_CART") {
            return res.status(400).json({ message: "장바구니가 비어 있습니다." });
        }
        if (err.message === "OUT_OF_STOCK") {
            return res.status(409).json({ message: "재고가 부족하거나 품절된 사이즈가 있습니다." });
        }
        if (err.message === "INVALID_CART_ITEM") {
            return res.status(400).json({ message: "장바구니 항목이 올바르지 않습니다." });
        }

        res.status(500).json({ message: "결제 처리 실패" });
    } finally {
        session.endSession();
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

// ✅ 관리자: 제품별 판매현황(전체)
// GET /api/orders/admin/products?from=2025-12-01&to=2025-12-31&page=1&limit=50&sort=revenue
router.get("/admin/products", requireAdmin, async (req, res) => {
    try {
        const { from, to, page = 1, limit = 50, sort = "revenue" } = req.query;

        const match = {};
        if (from || to) {
            match.paidAt = {};
            if (from) match.paidAt.$gte = new Date(from);
            if (to) match.paidAt.$lte = new Date(to);
        }

        const sortMap = {
            revenue: { revenue: -1 },
            quantity: { soldQty: -1 },
            name: { name: 1 },
        };

        const skip = (Number(page) - 1) * Number(limit);

        const basePipeline = [
            { $match: match },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    name: { $first: "$items.nameSnapshot" },
                    soldQty: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.lineTotal" }, // ✅ 할인 적용된 매출(스냅샷)
                },
            },
        ];

        const [rows, countArr] = await Promise.all([
            Order.aggregate([
                ...basePipeline,
                { $sort: sortMap[sort] || sortMap.revenue },
                { $skip: skip },
                { $limit: Number(limit) },
            ]),
            Order.aggregate([
                ...basePipeline,
                { $count: "total" },
            ]),
        ]);

        const total = countArr[0]?.total || 0;

        res.json({
            total,
            page: Number(page),
            limit: Number(limit),
            products: rows, // [{ _id(productId), name, soldQty, revenue }]
        });
    } catch (err) {
        console.error("GET /api/orders/admin/products error:", err);
        res.status(500).json({ message: "제품별 판매현황 조회 실패" });
    }
});

// =====================================================
// ✅ 관리자: 판매 요약(매출/주문수/판매수량) + 상품별 TOP
// GET /api/orders/admin/summary
// =====================================================
router.get("/admin/summary", requireAdmin, async (req, res) => {
    try {
        const { from, to, top = 10 } = req.query;

        const match = {};
        if (from || to) {
            match.paidAt = {};
            if (from) match.paidAt.$gte = new Date(from);
            if (to) match.paidAt.$lte = new Date(to);
        }

        const pipeline = [
            { $match: match },
            { $unwind: "$items" },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$items.lineTotal" },
                    totalQuantity: { $sum: "$items.quantity" },
                    orderIds: { $addToSet: "$_id" },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                    totalQuantity: 1,
                    totalOrders: { $size: "$orderIds" },
                },
            },
        ];

        const productTopPipeline = [
            { $match: match },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    name: { $first: "$items.nameSnapshot" },
                    soldQty: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.lineTotal" },
                },
            },
            { $sort: { revenue: -1 } },
            { $limit: Number(top) },
        ];

        const [summaryArr, topProducts] = await Promise.all([
            Order.aggregate(pipeline),
            Order.aggregate(productTopPipeline),
        ]);

        const summary = summaryArr[0] || {
            totalRevenue: 0,
            totalQuantity: 0,
            totalOrders: 0,
        };

        res.json({ summary, topProducts });
    } catch (err) {
        console.error("GET /api/orders/admin/summary error:", err);
        res.status(500).json({ message: "판매 요약 조회 실패" });
    }
});

module.exports = router;
