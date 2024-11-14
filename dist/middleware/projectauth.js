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
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectMiddleware = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const projectMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.userId);
    const projectId = req.params.projectId;
    if (!projectId) {
        res.status(400).json({ message: "Project ID is required" });
        return;
    }
    const project = yield prisma.project.findFirst({
        where: { id: Number(projectId), userId: userId },
    });
    if (!project) {
        res
            .status(403)
            .json({ message: "Access denied: Project not found or unauthorized" });
        return;
    }
    req.projectId = projectId;
    next();
});
exports.projectMiddleware = projectMiddleware;
