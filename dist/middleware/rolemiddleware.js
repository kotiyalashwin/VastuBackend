"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware = (req, res, next) => {
    var _a;
    try {
        const role = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.role;
        if (!role) {
        }
    }
    finally {
    }
};
