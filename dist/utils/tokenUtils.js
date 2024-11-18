"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookie = exports.setCookie = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
// Function to generate JWT token
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: "1h" }); // Set expiration time to 1 hour
};
exports.generateToken = generateToken;
// Function to set JWT token in cookies
const setCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only true in production
        sameSite: "none",
        maxAge: 60 * 60 * 1000, // 1 hour
    });
    console.log("Cookie Sent:", res.getHeaders()["set-cookie"]);
};
exports.setCookie = setCookie;
// Function to clear the cookie on logout
const clearCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
};
exports.clearCookie = clearCookie;
