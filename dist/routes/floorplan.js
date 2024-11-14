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
const cloudinaryulpoad_1 = require("../functions/cloudinaryulpoad");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const router = express_1.default.Router();
router.use((0, express_fileupload_1.default)());
//upload image
router.post("/image-upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, projectName } = req.body;
        if (!req.files || !req.files.image) {
            res.status(400).json({ message: "File is required" });
            return;
        }
        const file = req.files.image;
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
            data: uploadResult,
        });
    }
    catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({
            message: "Error uploading image",
        });
    }
}));
exports.default = router;
