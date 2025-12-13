// src/scripts/createDummyProducts.js
const path = require("path");

// backend/.env 강제로 사용
require("dotenv").config({
    path: path.join(__dirname, "..", "..", ".env")
});

const mongoose = require("mongoose");
const Product = require("../models/Product");

async function connectDB() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("❌ MONGODB_URI가 .env에 없습니다.");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB 연결 성공");
    } catch (err) {
        console.error("❌ DB 연결 실패:", err);
        process.exit(1);
    }
}

async function createDummyProducts() {
    await connectDB();

    console.log("🧹 기존 Product 삭제 중...");
    await Product.deleteMany({});

    console.log("🛒 더미 상품 10개 생성 중...");

    const baseNames = [
        "남성 울 크루저",
        "남성 울 러너 NZ",
        "남성 울 러너 NZ 워터프루프",
        "남성 울 크루저 슬립온",
        "남성 트리 라운저",
        "여성 울 크루저",
        "여성 울 스트라이더",
        "여성 트리 글라이더",
        "여성 울 러너 NZ 워터프루프",
        "여성 스트라이더 익스플로어"
    ];

    const today = new Date();

    const dummyProducts = [];

    for (let i = 0; i < 10; i++) {
        const idx = i + 1;

        // 이미지 URL
        const imageUrl = `/uploads/image${idx}.avif`;

        // 카테고리
        const category = i % 2 === 0 ? "LIFESTYLE" : "SLIPON";

        // 성별 순환
        const genderList = ["남성", "여성", "공용"];
        const gender = genderList[i % genderList.length];

        // 가격
        const basePrice = 79000 + i * 9000;

        // 할인율: 짝수는 할인, 홀수는 할인 없음
        const discountRate = i % 2 === 0 ? 10 + (i * 2 % 20) : 0;

        // 🔥 할인 날짜 설정
        let saleStart = null;
        let saleEnd = null;

        if (discountRate > 0) {
            saleStart = new Date(today);
            saleEnd = new Date(today);
            saleEnd.setDate(saleEnd.getDate() + 10); // 오늘 + 10일
        }

        const availableSizes = [230, 240, 250, 260, 270, 280];

        const materials = i % 2 === 0 ? ["울"] : ["트리"];

        const product = {
            name: baseNames[i],
            shortDesc: `${baseNames[i]} - 편안하고 데일리하게 신기 좋은 슈즈입니다.`,
            images: [imageUrl],
            categories: [category],
            basePrice,
            discountRate,
            availableSizes,
            gender,
            materials,
            saleStart,
            saleEnd,
            salesCount: 0
        };

        dummyProducts.push(product);
    }

    await Product.insertMany(dummyProducts);
    console.log("🎉 더미 상품 10개 등록 완료!");

    await mongoose.disconnect();
    console.log("🔌 DB 연결 종료");
}

// 실행
createDummyProducts().catch((err) => {
    console.error("예상치 못한 에러:", err);
    mongoose.disconnect();
});
