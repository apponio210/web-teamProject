// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        role: {
            type: String,
            enum: ["CUSTOMER", "ADMIN"],
            default: "CUSTOMER"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
