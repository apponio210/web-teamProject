// src/scripts/createDummyReviews.js
const path = require("path");

// backend/.env 사용
require("dotenv").config({
    path: path.join(__dirname, "..", "..", ".env")
});

const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
const Review = require("../models/Review");

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

function pickRandomUsers(users, count) {
    const copy = [...users];
    const result = [];

    for (let i = 0; i < count && copy.length > 0; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy[idx]);
        copy.splice(idx, 1);
    }
    return result;
}

async function createDummyReviews() {
    await connectDB();

    // 기존 리뷰 삭제
    console.log("🧹 기존 Review 삭제 중...");
    await Review.deleteMany({});

    // 🔥 USER 중 ADMIN 제외
    const users = await User.find({ role: "CUSTOMER" }).lean();
    const products = await Product.find().lean();

    if (users.length === 0) {
        console.error("❌ CUSTOMER 유저가 없습니다. 먼저 유저를 생성해주세요.");
        await mongoose.disconnect();
        return;
    }

    if (products.length === 0) {
        console.error("❌ 상품이 없습니다. 먼저 상품을 생성해주세요.");
        await mongoose.disconnect();
        return;
    }

    console.log(`👤 CUSTOMER 유저 수: ${users.length}`);
    console.log(`🥾 상품 수: ${products.length}`);

    const commentsPool = [
        "신발이 정말 편해요!",
        "디자인이 너무 예쁩니다.",
        "사이즈가 정사이즈입니다.",
        "가볍고 착용감이 좋아요.",
        "쿠션감이 좋아서 오래 신어도 편합니다.",
        "가격 대비 정말 괜찮아요.",
        "생각보다 고급스러워요!",
        "색감이 화면과 동일해요.",
        "데일리로 신기 좋아요.",
        "통풍이 잘 돼서 여름에도 신기 좋아요."
    ];

    const dummyReviews = [];

    for (const product of products) {
        // 각 상품당 CUSTOMER 유저 3명 랜덤 선택
        const reviewers = pickRandomUsers(users, 3);

        reviewers.forEach((user) => {
            const rating = 3 + Math.floor(Math.random() * 3); // 3~5점
            const comment =
                commentsPool[Math.floor(Math.random() * commentsPool.length)];

            dummyReviews.push({
                product: product._id,
                user: user._id,
                rating,
                comment
            });
        });
    }

    console.log(
        `📝 리뷰 생성 수: ${dummyReviews.length} (상품당 3개)`
    );

    await Review.insertMany(dummyReviews);

    console.log("🎉 더미 리뷰 생성 완료!");
    await mongoose.disconnect();
    console.log("🔌 DB 연결 종료");
}

createDummyReviews().catch((err) => {
    console.error("예상치 못한 에러:", err);
    mongoose.disconnect();
});
