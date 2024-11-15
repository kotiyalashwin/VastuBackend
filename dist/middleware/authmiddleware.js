"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authmiddleware = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        //token not present
        if (!token) {
            // res.status(401).json({
            //   message: "Unauthorized: No token provided",
            // });
            res.json({
                isAuthenticated: false,
            });
            return;
        }
        //token present
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (e) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
        return;
    }
};
exports.default = authmiddleware;
