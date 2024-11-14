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
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const client_1 = require("@prisma/client");
const projectValid_1 = require("../validation/projectValid");
const projectNumber_1 = require("../functions/projectNumber");
const cors_1 = __importDefault(require("cors"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// router.post("/project/:projectId/floorplan", authmiddleware, floorRouter);
router.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
}));
router.post("/newproject", authmiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.userId);
    const body = req.body;
    const { success } = projectValid_1.newProjectSchema.safeParse(body);
    try {
        if (!success) {
            res.status(500).json({ message: "Invalid Inputs" });
        }
        const newProjectNumber = yield (0, projectNumber_1.NewProjectNumber)(userId);
        const project = yield prisma.project.create({
            data: {
                name: body.name,
                type: body.type,
                numFloors: body.floorcount,
                address: body.address,
                userId: userId,
                projectnumber: newProjectNumber,
            },
            select: {
                name: true,
            },
        });
        res.json({
            message: `Project ${project.name} created successfully`,
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Error creating new project",
        });
    }
}));
router.get("/createdprojects/:projectnums?", authmiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = Number(req.userId);
    const projectnum = req.params.projectnum
        ? Number(req.params.projectnum)
        : undefined;
    try {
        if (!userID) {
            res.json({ message: "Invalid User" });
            return;
        }
        if (!projectnum) {
            const projects = yield prisma.project.findMany({
                where: {
                    userId: userID,
                },
            });
            res.json(projects);
            return;
        }
        const project = yield prisma.project.findUnique({
            where: {
                projectnumber: projectnum,
                userId: userID,
            },
            select: {
                name: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                    },
                },
                numFloors: true,
            },
        });
        if (!project) {
            res.status(500).json({
                message: "no project wit",
            });
            return;
        }
        res.json(project);
    }
    catch (e) {
        console.log("Error Retrieving Projects", e);
        res.status(500).json({ message: "Error in Projects Route" });
    }
}));
exports.default = router;
