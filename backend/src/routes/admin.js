// src/routes/admin.js
const express = require("express");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const { requireAdmin } = require("../middleware/auth");
const Product = require("../models/Product");
const Order = require("../models/Order");
const router = express.Router();

// 저장 위치: backend/uploads
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, "..", "..", "uploads"));
    },
    filename(req, file, cb) {
        // 파일 이름 그대로 사용 (image1.jpg 등)
        cb(null, file.originalname);
    }
});

// 간단한 이미지 필터 (선택사항)
function fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("이미지 파일만 업로드 가능합니다."), false);
    }
    cb(null, true);
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// -------------------------
// helpers
// -------------------------
function parseCsvToStringArray(value) {
    if (!value) return [];
    return String(value)
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
}

function parseCsvToNumberArray(value) {
    if (!value) return [];
    return String(value)
        .split(",")
        .map((v) => Number(String(v).trim()))
        .filter((n) => Number.isFinite(n));
}

// sizes 입력 형태 지원:
// 1) "250:10,260:0,270:5"
// 2) JSON 문자열 '[{"size":250,"stock":10},{"size":260,"stock":0}]'
function parseSizes(value) {
    if (!value) return [];

    const raw = String(value).trim();

    // JSON 문자열이면 우선 파싱 시도
    if (raw.startsWith("[") || raw.startsWith("{")) {
        try {
            const parsed = JSON.parse(raw);
            const arr = Array.isArray(parsed) ? parsed : [parsed];
            return arr
                .map((x) => ({
                    size: Number(x.size),
                    stock: Number(x.stock),
                }))
                .filter(
                    (x) => Number.isFinite(x.size) && Number.isFinite(x.stock) && x.stock >= 0
                );
        } catch {
            // fallback 아래로
        }
    }

    // "250:10,260:0" 형태
    return raw
        .split(",")
        .map((pair) => pair.trim())
        .filter(Boolean)
        .map((pair) => {
            const [s, st] = pair.split(":").map((x) => x.trim());
            return { size: Number(s), stock: Number(st) };
        })
        .filter(
            (x) => Number.isFinite(x.size) && Number.isFinite(x.stock) && x.stock >= 0
        );
}

// allSizes가 없으면 sizes에서 자동 생성
function buildAllSizes(allSizesArr, sizesArr) {
    if (allSizesArr && allSizesArr.length > 0) return Array.from(new Set(allSizesArr)).sort((a, b) => a - b);
    const derived = (sizesArr || []).map((x) => x.size);
    return Array.from(new Set(derived)).sort((a, b) => a - b);
}

// 상품 등록
router.post("/products", requireAdmin, upload.array("images", 10), async (req, res) => {
    try {
        const {
            name,
            short,        // ✅ 간단 설명
            shortDesc,    // ✅ 상세 설명
            images,
            categories,
            basePrice,
            discountRate,
            availableSizes,
            gender,        // 🔥 추가
            materials,
            saleStart,
            saleEnd,
            allSizes,     // ✅ "250,260,270"
            sizes,        // ✅ "250:10,260:0" 또는 JSON 문자열
        } = req.body;

        if (!name || !basePrice) {
            return res.status(400).json({
                message: "name, images(1개 이상), basePrice는 필수입니다."
            });
        }

        if (!req.files || req.files.length === 0) {
            return res
                .status(400)
                .json({ message: "이미지 파일은 최소 1개 이상 포함되어야 합니다." });
        }

        // 이미지 URL 배열 생성 (/uploads/image1.jpg 형식)
        const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

        // 문자열로 온 값들을 배열/숫자로 파싱
        const categoriesArr = categories
            ? categories.split(",").map((c) => c.trim())
            : [];

        const sizesArr = availableSizes
            ? availableSizes.split(",").map((s) => Number(s.trim()))
            : [];

        const materialsArr = materials
            ? materials.split(",").map((m) => m.trim())
            : [];

        const allSizesArr = buildAllSizes(parseCsvToNumberArray(allSizes), sizesArr);

        const discount = discountRate ? Number(discountRate) : 0;

        const product = await Product.create({
            name,
            short,
            shortDesc: shortDesc || "",
            images: imagePaths,
            categories: categoriesArr,
            basePrice: Number(basePrice),
            discountRate: Number.isFinite(discount) ? discount : 0,
            availableSizes: sizesArr,
            gender, // enum: ['남성','여성','공용']
            materials: materialsArr,
            saleStart: saleStart || null,
            saleEnd: saleEnd || null,
            allSizes: allSizesArr,
            sizes: sizesArr,
        });

        res.json(product);
    } catch (err) {
        console.error("POST /api/admin/products error:", err);
        res.status(500).json({ message: "상품 등록 실패" });
    }
});

// 가용 사이즈 변경
router.patch("/products/:id/sizes", requireAdmin, async (req, res) => {
    try {
        const { allSizes, sizes } = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "잘못된 상품 ID 형식입니다." });
        }

        const sizesArr = parseSizes(sizes);
        const allSizesArr = buildAllSizes(parseCsvToNumberArray(allSizes), sizesArr);

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { allSizes: allSizesArr, sizes: sizesArr },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        }

        res.json(product);
    } catch (err) {
        console.error("PATCH /api/admin/products/:id/sizes error:", err);
        res.status(500).json({ message: "사이즈/재고 변경 실패" });
    }
});

// 할인 정책 변경
router.patch("/products/:id/discount", requireAdmin, async (req, res) => {
    try {
        const { discountRate, saleStart, saleEnd } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                discountRate: discountRate ? Number(discountRate) : 0,
                saleStart: saleStart || null,
                saleEnd: saleEnd || null
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        }

        res.json(product);
    } catch (err) {
        console.error("PATCH /api/admin/products/:id/discount error:", err);
        res.status(500).json({ message: "할인 정책 변경 실패" });
    }
});

// 판매 현황 (기간 필터)
router.get("/sales", requireAdmin, async (req, res) => {
    try {
        const { start, end } = req.query;
        const startDate = start ? new Date(start) : new Date("1970-01-01");
        const endDate = end ? new Date(end) : new Date();

        const stats = await Order.aggregate([
            {
                $match: {
                    paidAt: { $gte: startDate, $lte: endDate }
                }
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    quantity: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.lineTotal" }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    productId: "$product._id",
                    name: "$product.name",
                    quantity: 1,
                    revenue: 1
                }
            }
        ]);

        res.json(stats);
    } catch (err) {
        console.error("GET /api/admin/sales error:", err);
        res.status(500).json({ message: "판매 현황 조회 실패" });
    }
});

module.exports = router;
