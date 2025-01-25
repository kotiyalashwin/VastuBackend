import express from "express";
import authmiddleware from "../middleware/authmiddleware";
import { projectMiddleware } from "../middleware/projectauth";
import fileUpload from "express-fileupload";
import {
  getFloorDetails,
  getFloorPlans,
  imageUpload,
  newFloor,
} from "../controller/floorplanController";
// import { addReport } from "../controller/reportController";

const router = express.Router();
router.use(fileUpload());

//upload image (form data)
router.post("/image-upload", imageUpload);

//add floor plan
router.post("/new-floorplan/:id", authmiddleware, newFloor);

// router.post("/report/addreport/:floorId", authmiddleware, addReport);

//specific floor plan
router.get("/getfloor/:floorid", getFloorDetails);

//bulk floor plan
router.get(
  "/floorplans/:projectId",
  authmiddleware,
  projectMiddleware,
  getFloorPlans
);

export default router;
