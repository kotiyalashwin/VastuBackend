import express from "express";
import authmiddleware, { authRequest } from "../middleware/authmiddleware";
import cors from "cors";
import {
  createProject,
  getCreatedProjects,
} from "../controller/projectController";

const router = express.Router();

router.post("/newproject", authmiddleware, createProject);
router.get("/createdprojects/:projectnum?", authmiddleware, getCreatedProjects);

export default router;
