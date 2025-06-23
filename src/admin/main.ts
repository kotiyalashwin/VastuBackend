import express from "express";
import { signIn } from "./auth";
import { router as dataRoute } from "./controller";
import { adminMiddleware } from "./middleware";
export const adminRouter = express.Router();

// const specialCors = cors({
//   origin: "https://admin.vastu-project.vercel.app",
// });
// adminRouter.use(specialCors);
adminRouter.use("/data", adminMiddleware, dataRoute);
adminRouter.post("/signin", signIn);
