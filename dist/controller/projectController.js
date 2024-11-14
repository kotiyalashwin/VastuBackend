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
exports.getCreatedProjects = exports.createProject = void 0;
const client_1 = require("@prisma/client");
const projectValid_1 = require("../validations/projectValid");
const projectNumber_1 = require("../utils/projectNumber");
const prisma = new client_1.PrismaClient();
// Create Project
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.userId); // From auth middleware
    const body = req.body;
    const { success } = projectValid_1.newProjectSchema.safeParse(body);
    try {
        if (!success) {
            res.status(500).json({ message: "Invalid Inputs" });
            return;
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
                id: true,
            },
        });
        res.json({
            message: `Project ${project.name} created successfully`,
            id: `Project ID : ${project.id}`,
        });
    }
    catch (e) {
        console.error("Error creating new project:", e);
        res.status(500).json({
            message: "Error creating new project",
        });
    }
});
exports.createProject = createProject;
// Get Created Projects
const getCreatedProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = Number(req.userId); // From auth middleware
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
                message: "No project found",
            });
            return;
        }
        res.json(project);
    }
    catch (e) {
        console.error("Error Retrieving Projects:", e);
        res.status(500).json({ message: "Error in Projects Route" });
    }
});
exports.getCreatedProjects = getCreatedProjects;
