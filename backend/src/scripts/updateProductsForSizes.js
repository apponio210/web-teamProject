// scripts/updateProductsForSizes.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

function buildAllSizes() {
    const arr = [];
    for (let s = 250; s <= 300; s += 5) arr.push(s);
    return arr;
}

function randInt(min, max) {
    // inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickUnique(arr, count) {
    const copy = [...arr];
    const picked = [];
    const n = Math.min(count, copy.length);
    for (let i = 0; i < n; i++) {
        const idx = randInt(0, copy.length - 1);
        picked.push(copy[idx]);
        copy.splice(idx, 1);
    }
    return picked;
}

async function main() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI가 .env에 없습니다.");
        process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");

    const allSizes = buildAllSizes();

    const products = await Product.find({}, { _id: 1, name: 1 }).lean();
    console.log(`📦 products: ${products.length}`);

    if (products.length === 0) {
        console.log("⚠️ 수정할 상품이 없습니다.");
        await mongoose.disconnect();
        return;
    }

    const ops = products.map((p) => {
        // 사용가능 사이즈 개수: 1~6 랜덤 (원하면 범위 조절)
        const k = 8;
        const available = pickUnique(allSizes, k).sort((a, b) => a - b);

        const sizes = available.map((size) => ({
            size,
            stock: randInt(1, 10), // ✅ 10개 이하 랜덤
        }));

        // short: 반드시 "캐주얼", "스니커즈" 포함
        const short = `캐주얼 스니커즈`;

        return {
            updateOne: {
                filter: { _id: p._id },
                update: {
                    $set: {
                        allSizes,
                        sizes,
                        short,
                    },
                    // 기존 availableSizes 필드 있으면 제거(선택)
                    $unset: { availableSizes: "" },
                },
            },
        };
    });

    const result = await Product.bulkWrite(ops, { ordered: false });
    console.log("✅ bulkWrite done:", {
        matched: result.matchedCount,
        modified: result.modifiedCount,
    });

    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
}

main().catch((err) => {
    console.error("❌ script error:", err);
    process.exit(1);
});
