"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.post("/signup", userController_1.signUp);
router.post("/signin", userController_1.signIn);
router.post("/logout", authmiddleware_1.default, userController_1.logout);
router.get("/session", authmiddleware_1.default, userController_1.getSession);
exports.default = router;
