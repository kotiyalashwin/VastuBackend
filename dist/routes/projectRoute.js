"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const cors_1 = __importDefault(require("cors"));
const projectController_1 = require("../controller/projectController");
const router = express_1.default.Router();
router.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
}));
router.post("/newproject", authmiddleware_1.default, projectController_1.createProject);
router.get("/createdprojects/:projectnum?", authmiddleware_1.default, projectController_1.getCreatedProjects);
exports.default = router;
