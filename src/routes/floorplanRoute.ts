import express from "express";
import authmiddleware from "../middleware/authmiddleware";
import { projectMiddleware } from "../middleware/projectauth";
import fileUpload from "express-fileupload";
import {
  getAnnotations,
  getFloorDetails,
  getFloorPlans,
  imageUpload,
} from "../controller/floorplanController";
import { addReport, getReport } from "../controller/reportController";

const router = express.Router();
router.use(fileUpload());

//upload image (form data)
router.post("/image-upload/:projectId", authmiddleware, imageUpload);

router.post("/report/addreport/:floorId", authmiddleware, addReport);

router.get("/report/getreport/:floorId", authmiddleware, getReport);

//specific floor plan
router.get("/getfloor/:floorid", getFloorDetails);
router.get("/getannotations/:floorId", getAnnotations);

//bulk floor plan
router.get(
  "/floorplans/:projectId",
  authmiddleware,
  projectMiddleware,
  getFloorPlans
);

export default router;
