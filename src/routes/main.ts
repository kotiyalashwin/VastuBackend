import express from "express";
import projectRoute from "./projectRoute";
import userRoute from "./userRoute";
import floorRoute from "./floorplanRoute";
import reportRoute from "./report";
import { getAssets } from "../controller/assets";

const router = express.Router();

router.use("/user", userRoute);
router.use("/project", projectRoute);
router.use("/floorplan", floorRoute);
router.use("/report", reportRoute);
router.get("/assets", getAssets);
module.exports = router;
