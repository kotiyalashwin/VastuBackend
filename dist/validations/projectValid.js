"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newProjectSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.newProjectSchema = zod_1.default.object({
    name: zod_1.default.string(),
    type: zod_1.default.string(),
    floorcount: zod_1.default.number(),
    address: zod_1.default.string(),
    consultantid: zod_1.default.string().optional(),
});
