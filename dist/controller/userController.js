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
const createAccount_1 = require("../utils/createAccount");
const prisma = new client_1.PrismaClient();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (!body) {
            // Send the response and return immediately
            res.json({ err: "Invalid Request" });
            return;
        }
        const { success } = userValidations_1.AccountSignUpSchema.safeParse(body);
        if (!success) {
            res.json({ err: "Invalid Inputs" });
            return;
        }
        const account = yield (0, createAccount_1.createAccount)(body, res);
        if ((account === null || account === void 0 ? void 0 : account.role) === "USER" && account.userId) {
            const role = (0, tokenUtils_1.generateToken)(account.role);
            const token = (0, tokenUtils_1.generateToken)(account.userId);
            (0, tokenUtils_1.setRoleCookie)(res, role);
            (0, tokenUtils_1.setTokenCookie)(res, token);
        }
        else if ((account === null || account === void 0 ? void 0 : account.role) === "CONSULTANT" && account.consultantId) {
            const role = (0, tokenUtils_1.generateToken)(account.role);
            const token = (0, tokenUtils_1.generateToken)(account.consultantId);
            (0, tokenUtils_1.setRoleCookie)(res, role);
            (0, tokenUtils_1.setTokenCookie)(res, token);
        }
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
    var _a, _b;
    const body = req.body;
    const { success } = userValidations_1.userSignInSchema.safeParse(body);
    if (!success) {
        res.status(401).json({
            msg: "Invalid Inputs",
        });
        return;
    }
    try {
        const account = yield prisma.account.findUnique({
            where: {
                email: body.email,
            },
            include: { user: true, consultant: true },
        });
        if (!account) {
            res.status(404).json({
                message: "No Account for this Id",
            });
            return;
        }
        if ((account === null || account === void 0 ? void 0 : account.role) === "USER" && account.user) {
            const passwordValid = yield bcrypt_1.default.compare(body.password, (_a = account.user) === null || _a === void 0 ? void 0 : _a.password);
            if (!passwordValid) {
                res.status(401).json({
                    message: "Invalid Credentials",
                });
                return;
            }
            const role = (0, tokenUtils_1.generateToken)(account.role);
            const token = (0, tokenUtils_1.generateToken)(account.user.id);
            (0, tokenUtils_1.setRoleCookie)(res, role);
            (0, tokenUtils_1.setTokenCookie)(res, token);
            res.status(200).json({ message: "Success" });
            return;
        }
        else if ((account === null || account === void 0 ? void 0 : account.role) === "CONSULTANT" && account.consultant) {
            const passwordValid = yield bcrypt_1.default.compare(body.password, (_b = account.consultant) === null || _b === void 0 ? void 0 : _b.password);
            if (!passwordValid) {
                res.status(401).json({
                    message: "Invalid Credentials",
                });
                return;
            }
            const role = (0, tokenUtils_1.generateToken)(account.role);
            const token = (0, tokenUtils_1.generateToken)(account.consultant.id);
            const uid = (0, tokenUtils_1.generateToken)(account.consultant.uniqueId);
            (0, tokenUtils_1.setRoleCookie)(res, role);
            (0, tokenUtils_1.setTokenCookie)(res, token);
            (0, tokenUtils_1.setUIDCookie)(res, uid);
            res.status(200).json({ message: "Success" });
        }
        // Send success message
    }
    catch (e) {
        console.error("Sign-in error:", e);
        res.status(500).json({ message: "An error occurred during sign-in" });
    }
});
exports.signIn = signIn;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Clear the token cookie upon logout
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only secure in production
            sameSite: "none",
        });
        res.clearCookie("role", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });
        if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.uid) {
            res.clearCookie("uid", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
            });
        }
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
        const userId = req.userId;
        const role = req.role;
        if (!userId || !role) {
            res.json({
                message: "session error : userId or role not in reques",
                isAuthenticated: false,
            });
            return;
        }
        // console.log(role);
        if (role === "USER") {
            const account = yield prisma.account.findFirst({
                where: { userId: userId },
                include: { user: true, consultant: true },
            });
            if (!account || !role) {
                console.log("no account");
                res.json({
                    isAuthenticated: false,
                });
                return;
            }
            res.json({
                username: account.name,
                userRole: account.role,
                isAuthenticated: true,
            });
        }
        else if (role === "CONSULTANT") {
            console.log(role);
            console.log(userId);
            const account = yield prisma.account.findFirst({
                where: { consultantId: userId },
                include: { user: true, consultant: true },
            });
            if (!account || !role) {
                console.log("no account");
                res.json({
                    isAuthenticated: false,
                });
                return;
            }
            res.json({
                username: account.name,
                userRole: account.role,
                isAuthenticated: true,
            });
        }
    }
    catch (e) {
        console.error("Session error:", e);
        res.status(500).json({
            error: `Unable to verify : ${e}`,
        });
    }
});
exports.getSession = getSession;
