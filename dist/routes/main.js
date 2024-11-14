"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectRoute_1 = __importDefault(require("./projectRoute"));
const userRoute_1 = __importDefault(require("./userRoute"));
const floorplanRoute_1 = __importDefault(require("./floorplanRoute"));
const router = express_1.default.Router();
router.use("/user", userRoute_1.default);
router.use("/project", projectRoute_1.default);
router.use("/floorplan", floorplanRoute_1.default);
module.exports = router;
