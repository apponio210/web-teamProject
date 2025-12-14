// src/models/Product.js
const mongoose = require("mongoose");

// 사이즈 + 재고 서브스키마 (문서 안에 그냥 박히게 _id 제거)
const sizeStockSchema = new mongoose.Schema(
    {
        size: { type: Number, required: true },          // 예: 250, 255...
        stock: { type: Number, required: true, min: 0 }, // 재고 수량
    },
    { _id: false }
);

// ✅ 상세 정보(아코디언에 들어가는 텍스트들)
const productDetailSchema = new mongoose.Schema(
    {
        description: { type: String, trim: true }, // "상세 정보" 본문
        usages: [{ type: String, trim: true }], // "용도" 리스트
        temperatureControl: { type: String, trim: true }, // "체온 조절"
        design: { type: String, trim: true }, // "디자인"
        madeIn: [{ type: String, trim: true }], // "제조국"
    },
    { _id: false }
);

// ✅ 지속 가능성 섹션
const sustainabilitySchema = new mongoose.Schema(
    {
        carbonFootprintKgCO2e: { type: Number, min: 0 }, // 4.99 같은 값
        description: { type: String, trim: true }, // 문단
        sustainableMaterials: [{ type: String, trim: true }], // 소재 리스트
    },
    { _id: false }
);

// ✅ 세탁/취급 주의사항 섹션
const careSchema = new mongoose.Schema(
    {
        instructions: [{ type: String, trim: true }], // 안내 문장 리스트
        tips: [{ type: String, trim: true }], // 팁 문장 리스트
    },
    { _id: false }
);

// ✅ 배송/반품 섹션
const shippingReturnSchema = new mongoose.Schema(
    {
        description: { type: String, trim: true },
        memberPolicy: { type: String, trim: true },
        nonMemberPolicy: { type: String, trim: true },
        returnPolicy: { type: String, trim: true },
        exchangePolicy: { type: String, trim: true },
    },
    { _id: false }
);
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },            // 제품명
        // 간단 설명
        short: { type: String, required: true, trim: true },
        shortDesc: { type: String },                       // 상세 설명
        images: [{ type: String, required: true }],        // 이미지 URL 배열
        categories: [
            {
                type: String,
                enum: ["LIFESTYLE", "SLIPON"]                  // 라이프 스타일, 슬립온
            }
        ],
        basePrice: { type: Number, required: true },       // 원가
        discountRate: { type: Number, default: 0, min: 0, max: 100 },        // 할인율 (%)
        // 전체 사이즈
        allSizes: { type: [Number], default: [] },

        // 사이즈별 재고
        sizes: { type: [sizeStockSchema], default: [] }, // 가용 사이즈 (예: 250, 255...)

        gender: {
            type: String,
            enum: ['남성', '여성', '공용'],
            default: '남성',
        },
        materials: [String],                               // 소재 태그 (예: "Tree", "Wool"...)
        saleStart: { type: Date },                         // 세일 시작일
        saleEnd: { type: Date },                           // 세일 종료일
        salesCount: { type: Number, default: 0 },           // 누적 판매 수량 (판매현황용)

        // ✅ 사이트의 아코디언 섹션들 저장
        details: { type: productDetailSchema, default: {} },
        sustainability: { type: sustainabilitySchema, default: {} },
        care: { type: careSchema, default: {} },
        shippingReturn: { type: shippingReturnSchema, default: {} },
    },
    { timestamps: true } // createdAt 으로 신제품 구분
);

// 가용 사이즈 (stock > 0)
productSchema.virtual("availableSizes").get(function () {
    return (this.sizes || [])
        .filter((s) => s.stock > 0)
        .map((s) => s.size);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// 실제 판매가 계산 (프론트에서 써도 되지만 편의를 위해)
productSchema.methods.getSalePrice = function () {
    if (!this.discountRate || this.discountRate <= 0) return this.basePrice;
    return Math.round(this.basePrice * (1 - this.discountRate / 100));
};

module.exports = mongoose.model("Product", productSchema);
