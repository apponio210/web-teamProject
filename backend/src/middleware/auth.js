// src/middleware/auth.js
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== "ADMIN") {
        return res.status(403).json({ message: "관리자만 접근 가능합니다." });
    }
    next();
}

module.exports = { requireAuth, requireAdmin };
