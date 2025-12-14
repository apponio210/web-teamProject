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

// ✅ 모든 상품 공통 상세정보(프론트 요구)
const COMMON_PRODUCT_INFO = {
    details: {
        description:
            "지속 가능한 방법으로 얻은 유칼립투스 섬유로 만든 니트 어퍼가 실크처럼 부드럽고 쾌적한 착화감을 선사합니다.",
        usages: [
            "사계절 데일리 스니커즈",
            "가벼운 워킹, 출퇴근/주말 외출에 적합",
        ],
        temperatureControl:
            "가벼운 유칼립투스 섬유가 열과 습기를 빠르게 배출해 오래 신어도 발을 쾌적한 온도로 유지해 줍니다.",
        design:
            "군더더기 없는 심플한 실루엣으로 비즈니스 캐주얼부터 주말 캐주얼룩까지 자연스럽게 어울립니다.",
        madeIn: ["베트남", "중국"],
    },
    sustainability: {
        carbonFootprintKgCO2e: 4.99,
        description:
            "Tree Runner의 탄소 발자국은 4.99 kg CO2e입니다.\n" +
            "탄소 발자국 표시와 탄소 배출량 저감을 위한 노력을 통해 올버즈는 Climate Neutral에서 탄소 중립 기업 인증을 획득했으며, 탄소 저감 프로젝트 펀딩을 비롯한 지속 가능한 활동을 통해 탄소 중립을 실현합니다.\n" +
            "지속 가능한 소재:",
        sustainableMaterials: [
            "FSC 인증 TENCEL™ Lyocell (유칼립투스 나무 섬유) 어퍼",
            "사탕수수 기반의 그린 EVA를 사용한 SweetFoam® 미드솔",
            "바이오나일론 신발끈 구멍",
            "플라스틱 페트병을 재활용한 신발 끈",
            "캐스터 빈 인솔",
        ],
    },
    care: {
        instructions: [
            "신발 끈을 신발에서 분리해주세요.",
            "깔창을 신발에서 분리하여 신발과 같이 세탁망(베개 커버도 가능)에 넣어주세요.",
            "세탁기 사용 시 찬물/울 코스로 중성세제를 적당량 첨가하여 세탁해 주시기 바랍니다.",
            "세탁 후에 남은 물기는 털어주시고 자연 건조해 주세요.",
            "1-2회 착용 후 원래 모양으로 곧 돌아오니 걱정하지 않으셔도 됩니다.",
            "더 새로운 경험을 원하시면 새로운 인솔과 신발 끈으로 교체하세요.",
        ],
        tips: [
            "건조기 사용은 피해주세요.",
            "세탁 후에 원래 모양으로 곧 돌아오니 걱정 마세요.",
            "신발 끈과 인솔은 손세탁 하셔도 됩니다.",
        ],
    },
    shippingReturn: {
        description:
            "5만원 이상 무료 배송과 함께, 세일 제품도 7일 이내 미착용 시 교환·환불이 가능합니다. 아래에서 자세한 배송 및 반품 안내를 확인하세요.",
        memberPolicy:
            "회원: 무료 배송 & 30일 내 무료 교환/환불 (단, 세일 제품은 7일 내 미착용 시 교환/환불)",
        nonMemberPolicy: "비회원: 7일 내 미착용 시 교환/환불",
        returnPolicy:
            "반품: 물류센터에 반송품이 도착한 뒤 5 영업일 내 검수 후 환불",
        exchangePolicy:
            "교환: 동일 가격의 상품으로만 교환 가능, 맞교환 불가, 물류센터에 반송품이 도착한 뒤 새로운 교환 상품 발송 (교환 일정 7~10 영업일 소요)",
    },
};

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


            // ✅ 등록 시 공통 내용 자동 주입
            ...COMMON_PRODUCT_INFO,
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
