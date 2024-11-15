"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const floorplanController_1 = require("../controller/floorplanController");
const router = express_1.default.Router();
router.use((0, express_fileupload_1.default)());
//upload image (form data)
router.post("/image-upload", floorplanController_1.imageUpload);
//add floor plan
router.post("/new-floorplan/:id", authmiddleware_1.default, floorplanController_1.newFloor);
//bulk floor plan
router.get("/floorplans", authmiddleware_1.default, floorplanController_1.getFloorPlans);
exports.default = router;
