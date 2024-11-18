import express from "express";
require("dotenv").config();
import cors, { CorsOptions } from "cors";

const app = express();
const mainRouter = require("./routes/main");
const port = process.env.PORT || 3000;
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow specific origins or all origins
    const allowedOrigins = ["https://vastu-project.vercel.app/"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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

app.use(cors(corsOptions));
app.use(require("cookie-parser")());
app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(port, () => {
  console.log(`Vastu Backend Running on port ${port} `);
});
