// src/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },            // 제품명
        shortDesc: { type: String },                       // 간단 소개
        images: [{ type: String, required: true }],        // 이미지 URL 배열
        categories: [
            {
                type: String,
                enum: ["LIFESTYLE", "SLIPON"]                  // 라이프 스타일, 슬립온
            }
        ],
        basePrice: { type: Number, required: true },       // 원가
        discountRate: { type: Number, default: 0, min: 0, max: 100 },        // 할인율 (%)
        availableSizes: [Number],                          // 가용 사이즈 (예: 250, 255...)
        gender: {
            type: String,
            enum: ['남성', '여성', '공용'],
            default: '남성',
        },
        materials: [String],                               // 소재 태그 (예: "Tree", "Wool"...)
        saleStart: { type: Date },                         // 세일 시작일
        saleEnd: { type: Date },                           // 세일 종료일
        salesCount: { type: Number, default: 0 }           // 누적 판매 수량 (판매현황용)
    },
    { timestamps: true } // createdAt 으로 신제품 구분
);

// 실제 판매가 계산 (프론트에서 써도 되지만 편의를 위해)
productSchema.methods.getSalePrice = function () {
    if (!this.discountRate || this.discountRate <= 0) return this.basePrice;
    return Math.round(this.basePrice * (1 - this.discountRate / 100));
};

module.exports = mongoose.model("Product", productSchema);
