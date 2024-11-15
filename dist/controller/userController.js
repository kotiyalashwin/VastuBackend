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
exports.getSession = exports.logout = exports.signIn = exports.signUp = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userValidations_1 = require("../validations/userValidations");
const tokenUtils_1 = require("../utils/tokenUtils");
const prisma = new client_1.PrismaClient();
const secret = process.env.JWT_SECRET;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (!body) {
            // Send the response and return immediately
            res.json({ err: "Invalid Request" });
            return;
        }
        const { success } = userValidations_1.userSignUpSchema.safeParse(body);
        if (!success) {
            res.json({ err: "Invalid Inputs" });
            return;
        }
        // Hash the password before saving
        const hashedpass = yield bcrypt_1.default.hash(body.password, 10);
        // Create a new user in the database
        const user = yield prisma.user.create({
            select: {
                id: true,
            },
            data: Object.assign({ name: body.name, email: body.email, password: hashedpass }, (body.phone && { phone: body.phone })),
        });
        // Generate a JWT token for the new user
        const token = (0, tokenUtils_1.generateToken)(user.id);
        // Set the token in the response cookie
        (0, tokenUtils_1.setCookie)(res, token);
        // Send success message
        res.status(200).json({
            message: "User created successfully",
        });
    }
    catch (e) {
        console.error(e);
        // Handle any errors and send failure response
        res.status(500).json({
            msg: "Unable to add new user",
        });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { success } = userValidations_1.userSignInSchema.safeParse(body);
    if (!success) {
        res.status(401).json({
            msg: "Invalid Inputs",
        });
        return;
    }
    try {
        // Check if the user exists and if they are active
        const user = yield prisma.user.findUnique({
            where: { email: body.email, active: true },
        });
        if (!user) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }
        // Compare the provided password with the stored hash
        const passwordValid = yield bcrypt_1.default.compare(body.password, user.password);
        if (!passwordValid) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        // Generate a JWT token for the user
        const token = (0, tokenUtils_1.generateToken)(user.id);
        // Set the token in the response cookie
        (0, tokenUtils_1.setCookie)(res, token);
        // Send success message
        res.status(200).json({ message: "Success" });
    }
    catch (e) {
        console.error("Sign-in error:", e);
        res.status(500).json({ message: "An error occurred during sign-in" });
    }
});
exports.signIn = signIn;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the token cookie upon logout
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only secure in production
            sameSite: "lax",
        });
        res.json({ message: "Logged out successfully" });
    }
    catch (e) {
        console.error("Logout error:", e);
        res.status(500).json({ message: "An error occurred during logout" });
    }
});
exports.logout = logout;
const getSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId || false;
        if (!userId) {
            res.json({
                isAuthenticated: false,
            });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: { id: Number(userId) },
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
        console.error("Session error:", e);
        res.status(500).json({
            error: `Unable to verify : ${e}`,
        });
    }
});
exports.getSession = getSession;
