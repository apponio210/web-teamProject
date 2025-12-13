// src/db.js
const mongoose = require("mongoose");

async function connectDB(mongoUri) {
    try {
        await mongoose.connect(mongoUri);
        console.log("✅ MongoDB 연결 성공");
    } catch (err) {
        console.error("❌ MongoDB 연결 실패:", err);
        process.exit(1);
    }
}

module.exports = connectDB;
