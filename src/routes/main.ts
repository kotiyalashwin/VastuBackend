import express from "express";
import projectRoute from "./projectRoute";
import userRoute from "./userRoute";
import floorRoute from "./floorplanRoute";

const router = express.Router();

router.use("/user", userRoute);
router.use("/project", projectRoute);
router.use("/floorplan", floorRoute);

module.exports = router;
