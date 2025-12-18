// src/routes/cart.js
const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

// 유저 Cart 가져오거나 새로 생성
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate("items.product");
  }
  return cart;
}

// unitPrice / lineTotal 재계산
async function recalcCart(cart) {
  cart = await cart.populate("items.product");

  cart.items.forEach((item) => {
    const product = item.product;
    const salePrice =
      typeof product.getSalePrice === "function"
        ? product.getSalePrice()
        : product.basePrice;

    item.unitPrice = salePrice;
    item.lineTotal = salePrice * item.quantity;
  });

  await cart.save();
  return cart;
}

// ✅ 상품 사이즈 재고 조회 헬퍼
async function getSizeStock(productId, sizeNum) {
  const product = await Product.findById(productId).select("sizes").lean();

  if (!product) return { ok: false, reason: "NOT_FOUND" };

  const row = (product.sizes || []).find(
    (s) => Number(s.size) === Number(sizeNum)
  );
  if (!row) return { ok: false, reason: "SIZE_NOT_EXIST" };

  return { ok: true, stock: Number(row.stock || 0) };
}

// 장바구니 조회
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const cart = await getOrCreateCart(userId);
    res.json(cart);
  } catch (err) {
    console.error("GET /api/cart error:", err);
    res.status(500).json({ message: "장바구니 조회 실패" });
  }
});

// 장바구니 담기
router.post("/add", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { productId, size, quantity } = req.body;

    const sizeNum = Number(size);
    const qtyNum = Number(quantity);

    if (!productId || !Number.isFinite(sizeNum) || !Number.isFinite(qtyNum)) {
      return res
        .status(400)
        .json({ message: "productId, size, quantity는 필수입니다." });
    }
    if (sizeNum <= 0) {
      return res.status(400).json({ message: "사이즈를 선택해주세요." });
    }
    if (qtyNum < 1) {
      return res.status(400).json({ message: "수량은 1 이상이어야 합니다." });
    }

    const sizeInfo = await getSizeStock(productId, sizeNum);
    if (!sizeInfo.ok) {
      if (sizeInfo.reason === "NOT_FOUND") {
        return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
      }
      return res
        .status(400)
        .json({ message: "선택한 사이즈는 제공되지 않습니다." });
    }
    if (sizeInfo.stock <= 0) {
      return res.status(409).json({ message: "해당 사이즈는 품절입니다." });
    }

    let cart = await getOrCreateCart(userId);

    const existing = cart.items.find(
      (item) =>
        item.product.toString() === productId.toString() &&
        item.size === sizeNum
    );

    const newQty = (existing ? existing.quantity : 0) + qtyNum;
    if (newQty > sizeInfo.stock) {
      return res
        .status(409)
        .json({ message: `재고가 부족합니다. (남은 수량: ${sizeInfo.stock})` });
    }

    if (existing) {
      existing.quantity += qtyNum;
    } else {
      cart.items.push({
        product: productId,
        size: sizeNum,
        quantity: qtyNum,
        unitPrice: 0,
        lineTotal: 0,
      });
    }

    cart = await recalcCart(cart);
    res.json(cart);
  } catch (err) {
    console.error("POST /api/cart/add error:", err);
    res.status(500).json({ message: "장바구니 담기 실패" });
  }
});

// 수량 변경
router.patch("/item", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { productId, size, quantity } = req.body;

    const sizeNum = Number(size);
    const qtyNum = Number(quantity);

    if (!productId || !Number.isFinite(sizeNum) || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "productId, size, quantity는 필수입니다." });
    }

    let cart = await getOrCreateCart(userId);

    const idx = cart.items.findIndex((item) => {
      const itemProductId = item.product?._id
        ? item.product._id.toString()
        : item.product.toString();
      return itemProductId === productId.toString() && item.size === sizeNum;
    });

    if (idx === -1) {
      return res
        .status(404)
        .json({ message: "장바구니에 해당 상품이 없습니다." });
    }

    if (qtyNum <= 0) {
      cart.items.splice(idx, 1);
      cart = await recalcCart(cart);
      return res.json(cart);
    }

    const sizeInfo = await getSizeStock(productId, sizeNum);
    if (!sizeInfo.ok) {
      return res
        .status(400)
        .json({ message: "선택한 사이즈는 제공되지 않습니다." });
    }
    if (qtyNum > sizeInfo.stock) {
      return res
        .status(409)
        .json({ message: `재고가 부족합니다. (남은 수량: ${sizeInfo.stock})` });
    }

    cart.items[idx].quantity = qtyNum;
    cart = await recalcCart(cart);
    res.json(cart);
  } catch (err) {
    console.error("PATCH /api/cart/item error:", err);
    res.status(500).json({ message: "장바구니 수정 실패" });
  }
});

// 장바구니 전체 비우기
router.delete("/clear", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;

    let cart = await getOrCreateCart(userId);
    cart.items = [];
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("DELETE /api/cart/clear error:", err);
    res.status(500).json({ message: "장바구니 비우기 실패" });
  }
});

// 특정 아이템 삭제
router.delete("/:itemId", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { itemId } = req.params;

    let cart = await getOrCreateCart(userId);

    const beforeLen = cart.items.length;
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    if (cart.items.length === beforeLen) {
      return res
        .status(404)
        .json({ message: "장바구니에 해당 아이템이 없습니다." });
    }

    cart = await recalcCart(cart);

    res.json(cart);
  } catch (err) {
    console.error("DELETE /api/cart/item error:", err);
    res.status(500).json({ message: "장바구니 항목 삭제 실패" });
  }
});

module.exports = router;
