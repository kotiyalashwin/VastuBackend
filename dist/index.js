"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const cors = require("cors");
const app = (0, express_1.default)();
const mainRouter = require("./routes/main");
const port = process.env.PORT || 3000;
app.use(cors({
    origin: "http://localhost:5173/",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
}));
app.use(express_1.default.json());
app.use(require("cookie-parser")());
app.use("/api/v1", mainRouter);
app.listen(port, () => {
    console.log(`Vastu Backend Running on port ${port} `);
});
