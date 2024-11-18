"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const mainRouter = require("./routes/main");
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: (origin, callback) => {
        // Allow specific origins or all origins
        const allowedOrigins = ["http://localhost:5173"];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allow all necessary methods
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Access-Control-Allow-Origin",
    ], // Include all custom headers you might use
    exposedHeaders: ["Authorization", "Content-Length", "X-Kuma-Revision"], // Headers accessible to frontend
    credentials: true, // Allow credentials (cookies, authorization headers)
    preflightContinue: false, // Pass preflight responses to the next middleware
    optionsSuccessStatus: 204, // For legacy browsers that choke on 204
};
app.use((0, cors_1.default)(corsOptions));
app.use(require("cookie-parser")());
app.use(express_1.default.json());
app.use("/api/v1", mainRouter);
app.listen(port, () => {
    console.log(`Vastu Backend Running on port ${port} `);
});
