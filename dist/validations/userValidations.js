"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignInSchema = exports.AccountSignUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.AccountSignUpSchema = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    phone: zod_1.default.string().optional(),
    password: zod_1.default.string().min(6),
    role: zod_1.default.string(),
});
exports.userSignInSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
