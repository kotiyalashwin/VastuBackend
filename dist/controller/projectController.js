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
exports.deleteProject = exports.selectForReview = exports.getCreatedProjects = exports.createProject = void 0;
const client_1 = require("@prisma/client");
const projectValid_1 = require("../validations/projectValid");
const projectNumber_1 = require("../utils/projectNumber");
const prisma = new client_1.PrismaClient();
// Create Project
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // From auth middleware
    const body = req.body;
    const role = req.role;
    if (role === "CONSULTANT") {
        res.status(403).json({
            message: "A consultant cannot create new projects",
        });
        return;
    }
    const { success } = projectValid_1.newProjectSchema.safeParse(body);
    try {
        if (!success) {
            res.status(500).json({ message: "Invalid Inputs" });
            return;
        }
        console.log(body.consultantid);
        if (body.consultantid) {
            const consultant = yield prisma.consultant.findUnique({
                where: {
                    uniqueId: body.consultantid,
                },
            });
            console.log(consultant);
            if (!consultant) {
                res.status(404).json({
                    error: "No consultant for this Id",
                });
                return;
            }
        }
        const newProjectNumber = yield (0, projectNumber_1.NewProjectNumber)(userId);
        // const newProjectNumber = 10;
        const project = yield prisma.project.create({
            data: Object.assign({ name: body.name, type: body.type, numFloors: body.floorcount, address: body.address, userId: userId, projectnumber: newProjectNumber }, (body.consultantid && { consultantId: body.consultantid })),
            select: {
                name: true,
                id: true,
            },
        });
        res.json({
            message: `Project ${project.name} created successfully`,
            id: project.id,
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
    const userID = String(req.userId); // From auth middleware
    const role = req.role;
    try {
        if (!userID || !role) {
            res.json({ message: "Invalid User" });
            return;
        }
        if (role === "USER") {
            const project = yield prisma.project.findMany({
                where: {
                    userId: userID,
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
        else if (role === "CONSULTANT") {
            const project = yield prisma.project.findMany({
                where: {
                    consultant: {
                        id: userID,
                    },
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
    }
    catch (e) {
        console.error("Error Retrieving Projects:", e);
        res.status(500).json({ message: "Error in Projects Route" });
    }
});
exports.getCreatedProjects = getCreatedProjects;
const selectForReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = Number(req.params.projectId);
        const consUID = req.consUID;
        if (!projectId) {
            res.status(500).json({
                message: "project Id is required",
            });
            return;
        }
        console.log(consUID);
        if (!consUID) {
            res.status(403).json({
                message: "Not a Valid User/Consultant ID invalid",
            });
            return;
        }
        yield prisma.project.update({
            where: { id: projectId, consultantId: consUID },
            data: { status: "REVIEWING" },
        });
        res.status(200).json({
            message: "Successfully selected project for review",
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Unable to Select For review",
        });
    }
});
exports.selectForReview = selectForReview;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = Number(req.params.projectId);
        if (req.role === "CONSULTANT") {
            throw new Error("UnAuthorized");
        }
        const projectExist = yield prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!projectExist) {
            throw new Error("No such project");
        }
        yield prisma.project.delete({
            where: { id: projectId },
        });
        res.json({
            message: "Project Deleted Successfully",
        });
    }
    catch (e) {
        throw new Error("Error Deleting Project");
    }
});
exports.deleteProject = deleteProject;
