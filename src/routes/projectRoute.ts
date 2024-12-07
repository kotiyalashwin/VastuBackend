import express from "express";
import authmiddleware from "../middleware/authmiddleware";
// import cors from "cors";
import {
  createProject,
  deleteProject,
  getCreatedProjects,
  selectForReview,
} from "../controller/projectController";
import { projectMiddleware } from "../middleware/projectauth";

const router = express.Router();

router.post("/newproject", authmiddleware, createProject);
router.get("/createdprojects", authmiddleware, getCreatedProjects);
router.put("/select-review/:projectId", authmiddleware, selectForReview);
router.delete(
  "/deleteproject/:projectId",
  authmiddleware,
  projectMiddleware,
  deleteProject
);

export default router;
