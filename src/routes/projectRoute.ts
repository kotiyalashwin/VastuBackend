import express from "express";
import authmiddleware, { authRequest } from "../middleware/authmiddleware";
import cors from "cors";
import {
  createProject,
  getCreatedProjects,
} from "../controller/projectController";

const router = express.Router();

router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

router.post("/newproject", authmiddleware, createProject);
router.get("/createdprojects/:projectnum?", authmiddleware, getCreatedProjects);

export default router;
