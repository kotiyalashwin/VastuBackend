"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authmiddleware = (req, res, next) => {
    var _a, _b, _c;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        const role = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.role;
        // console.log(token);
        //token not present
        if (!token || !role) {
            // res.status(401).json({
            //   message: "Unauthorized: No token provided",
            // });
            res.json({
                message: "token or role cookie absent",
                isAuthenticated: false,
            });
            return;
        }
        //token present
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const decodedRole = jsonwebtoken_1.default.verify(role, process.env.JWT_SECRET);
        // get CONSUID from cookies
        if (decodedRole.userId === "CONSULTANT") {
            const consuid = (_c = req.cookies) === null || _c === void 0 ? void 0 : _c.uid;
            const decodedUID = jsonwebtoken_1.default.verify(consuid, process.env.JWT_SECRET);
            req.consUID = decodedUID.userId;
        }
        req.userId = decodedToken.userId;
        req.role = decodedRole.userId;
        next();
    }
    catch (e) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
        return;
    }
};
exports.default = authmiddleware;
