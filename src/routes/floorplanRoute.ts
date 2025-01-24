import express from "express";
import authmiddleware from "../middleware/authmiddleware";
import { projectMiddleware } from "../middleware/projectauth";
import fileUpload from "express-fileupload";
import {
  getFloorPlans,
  imageUpload,
  newFloor,
} from "../controller/floorplanController";

const router = express.Router();
router.use(fileUpload());

//upload image (form data)
router.post("/image-upload", imageUpload);

//add floor plan
router.post("/new-floorplan/:id", authmiddleware, newFloor);

//bulk floor plan
router.get(
  "/floorplans/:projectId",
  authmiddleware,
  projectMiddleware,
  getFloorPlans
);

export default router;
