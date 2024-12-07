"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueId = void 0;
const generateUniqueId = (id) => {
    return `CONS${String(id).padStart(5, "0")}`;
};
exports.generateUniqueId = generateUniqueId;
