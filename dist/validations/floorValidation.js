"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newFloorSchema = void 0;
const zod_1 = require("zod");
exports.newFloorSchema = zod_1.z.object({
    floorNumber: zod_1.z.number(),
    description: zod_1.z.string().optional(),
    floorPlan: zod_1.z.string().url(),
});
