// scripts/createDummyUsers.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // 경로 맞춰주세요

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
        process.exit(1);
    }
}

async function createDummyUsers() {
    const names = [
        "김민수", "이서준", "박지후", "최도현", "정예준",
        "한지우", "오은우", "서현우", "조민재", "배지안",
        "강하린", "장서윤", "홍다은", "유다현", "신지민",
        "문서영", "임아린", "권시윤", "하예린", "노하윤",
        "관리자"
    ];

    await connectDB();

    console.log("🧹 기존 사용자 삭제 중...");
    await User.deleteMany({}); // 기존 유저 싹 비움 (원하면 삭제!)

    const users = [];

    for (let i = 0; i < 21; i++) {
        const email = `user${i + 1}@test.com`;
        const password = await bcrypt.hash("000000", 10); // 모든 더미 계정 비번 같음
        const name = names[i];
        const phone = `010-${String(1000 + i)}-${String(2000 + i)}`;

        const user = new User({
            email,
            passwordHash: password,
            name,
            phone,
            role: "CUSTOMER"
        });

        users.push(user);
    }

    await User.insertMany(users);

    console.log("🎉 21명의 더미 유저 생성 완료!");
    mongoose.disconnect();
}

createDummyUsers();
