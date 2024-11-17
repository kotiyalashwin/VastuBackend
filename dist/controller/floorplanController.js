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
exports.getFloorPlans = exports.newFloor = exports.imageUpload = void 0;
const cloudinaryulpoad_1 = require("../utils/cloudinaryulpoad");
const client_1 = require("@prisma/client");
const floorValidation_1 = require("../validations/floorValidation");
const prisma = new client_1.PrismaClient();
const imageUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { userName, projectName } = req.body;
        // console.log(req.files);
        if (!req.files || !req.files.image) {
            res.status(400).json({ message: "File is required" });
            return;
        }
        const file = req.files.image;
        console.log(file);
        if (!userName || !projectName || !file) {
            res
                .status(400)
                .json({ message: "Username, projectname, and file are required" });
            return;
        }
        const imageBuffer = Array.isArray(file)
            ? file[0].data
            : file.data;
        const folderPath = `VastuProject/${userName}/${projectName}`;
        const uploadResult = yield (0, cloudinaryulpoad_1.uploadImageToCloudinary)(imageBuffer, folderPath);
        res.status(200).json({
            message: "Image uploaded successfully",
            imageURL: uploadResult.result,
        });
        // console.log(uploadResult.url);
    }
    catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({
            message: "Error uploading image",
        });
    }
});
exports.imageUpload = imageUpload;
const newFloor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const projectId = Number(req.params.id);
        const { success } = floorValidation_1.newFloorSchema.safeParse(body);
        if (!success) {
            res.status(500).json({
                error: "Invalid Inputs",
            });
            return;
        }
        const { floorNumber, floorPlan, description } = body;
        const newFloor = yield prisma.projectFloor.create({
            data: {
                floornumber: floorNumber,
                floorplan: floorPlan,
                description: description,
                projectId: projectId,
            },
        });
        res.status(200).json({
            message: "Floor Plan added successfully",
        });
    }
    catch (e) {
        console.error("Error creating new floorplan:", e);
        res.status(500).json({
            message: "Error creating new floorplan",
        });
    }
});
exports.newFloor = newFloor;
const getFloorPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log;
        const projectId = Number(req.params.projectId);
        if (!projectId) {
            res.status(401).json({
                message: "Unauthorized Request. Please Login/SignUp",
            });
            return;
        }
        prisma.projectFloor
            .findMany({
            where: {
                projectId: projectId,
            },
        })
            .then((data) => {
            if (!data) {
                res.status(500).json({
                    message: "No floor plans Found for this project",
                });
                return;
            }
            res.json(data);
        });
        // if (!floorPlans) {
        //   res.status(500).json({
        //     message: "No floor plans Found for this project",
        //   });
        //   return;
        // }
        // res.status(200).json({
        //   floorPlans,
        // });
    }
    catch (e) {
        console.error("Error retreiving floorplan:", e);
        res.status(500).json({
            message: "Error finding floorplan",
        });
    }
});
exports.getFloorPlans = getFloorPlans;
