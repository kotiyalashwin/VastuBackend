"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
// import cors from "cors";
const projectController_1 = require("../controller/projectController");
const projectauth_1 = require("../middleware/projectauth");
const router = express_1.default.Router();
router.post("/newproject", authmiddleware_1.default, projectController_1.createProject);
router.get("/createdprojects", authmiddleware_1.default, projectController_1.getCreatedProjects);
router.put("/select-review/:projectId", authmiddleware_1.default, projectController_1.selectForReview);
router.delete("/deleteproject/:projectId", authmiddleware_1.default, projectauth_1.projectMiddleware, projectController_1.deleteProject);
exports.default = router;
