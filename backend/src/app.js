// src/app.js
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./db");

const fs = require("fs");
const YAML = require("yaml");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");
const reviewRoutes = require("./routes/reviews");

const openapiPath = path.join(__dirname, "../src", "swagger", "openapi.yaml");
const openapiText = fs.readFileSync(openapiPath, "utf8");
const openapiSpec = YAML.parse(openapiText);

const app = express();

// Swagger UI
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, {
        swaggerOptions: {
            withCredentials: true, // 세션 쿠키 테스트 편함
        },
    })
);

const {
    MONGODB_URI,
    SESSION_SECRET,
    CLIENT_ORIGIN,
    PORT = 3000
} = process.env;

// DB 연결
connectDB(MONGODB_URI);

// 미들웨어
app.use(
    cors({
        origin: CLIENT_ORIGIN,
        credentials: true
    })
);
app.use(morgan("dev"));
app.use(express.json());

// 🔹 업로드된 이미지를 /uploads 경로로 제공
app.use(
    "/uploads",
    express.static(path.join(__dirname, "..", "uploads"))
);

// 세션 설정
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            // 개발용: true/false 조절 (https 쓸 때는 secure: true)
            secure: false
        },
        store: MongoStore.create({
            mongoUrl: MONGODB_URI,
            collectionName: "sessions"
        })
    })
);

// 라우팅
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);

// 헬스 체크
app.get("/", (req, res) => {
    res.send("Shoe shop backend running");
});

app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
