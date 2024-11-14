"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const userValid_1 = require("../validation/userValid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const bcrypt = require("bcrypt");
const secret = process.env.JWT_SECRET;
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (!body) {
            res.json({ err: "Invalid Request" });
            return;
        }
        const { success } = userValid_1.userSignUpSchema.safeParse(body);
        if (!success) {
            res.json({ err: "Invalid Inputs" });
        }
        const hashedpass = yield bcrypt.hash(body.password, 10);
        const user = yield prisma.user.create({
            select: {
                id: true,
            },
            data: Object.assign({ name: body.name, email: body.email, password: hashedpass }, (body.phone && { phone: body.phone })),
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true only on HTTPS
            sameSite: "lax",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        console.log("Cookie Sent:", res.getHeaders()["set-cookie"]);
        res.status(200).json({
            message: "User created successfully",
        });
    }
    catch (e) {
        res.json({
            msg: "unable to add new user",
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { success } = userValid_1.userSignInSchema.safeParse(body);
    if (!success) {
        res.status(401).json({
            msg: "Invalid Inputs",
        });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
            where: { email: body.email, active: true },
        });
        if (!user) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }
        const passwordValid = yield bcrypt.compare(body.password, user.password);
        if (!passwordValid) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true only on HTTPS
            sameSite: "lax",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.status(200).json({ message: "Success" });
    }
    catch (e) {
        console.error("Sign-in error:", e);
        res.status(500).json({ message: "An error occurred during sign-in" });
    }
}));
router.post("/logout", authmiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.json({ message: "Logged out successfully" });
}));
router.get("/session", authmiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.json({
                isAuthenticated: false,
            });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: {
                id: Number(userId),
            },
        });
        if (!user) {
            res.json({
                isAuthenticated: false,
            });
            return;
        }
        res.json({
            username: user.name,
            isAuthenticated: true,
        });
    }
    catch (e) {
        res.status(500).json({
            error: `Unable to verify : ${e}`,
        });
    }
}));
exports.default = router;
