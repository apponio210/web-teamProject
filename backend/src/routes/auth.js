// src/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// 회원가입
router.post("/register", async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password || !name || !phone) {
            return res
                .status(400)
                .json({ message: "email, password, name, phone는 필수입니다." });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "이미 가입된 이메일입니다." });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            passwordHash,
            name,
            phone
        });

        // 세션에 최소 정보 저장
        req.session.user = {
            id: user._id,
            role: user.role,
            name: user.name
        };

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role
        });
    } catch (err) {
        console.error("POST /api/auth/register error:", err);
        res.status(500).json({ message: "회원가입 실패" });
    }
});

// 로그인
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "email과 password를 모두 입력해주세요." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res
                .status(401)
                .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        }

        req.session.user = {
            id: user._id,
            role: user.role,
            name: user.name
        };

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role
        });
    } catch (err) {
        console.error("POST /api/auth/login error:", err);
        res.status(500).json({ message: "로그인 실패" });
    }
});

// 내 정보
router.get("/me", (req, res) => {
    if (!req.session.user) return res.json(null);
    res.status(200).json(req.session.user);
});

// 로그아웃
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "로그아웃 완료" });
    });
});

module.exports = router;
