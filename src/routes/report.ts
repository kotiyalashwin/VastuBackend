import express from "express";
import { generateReport } from "../controller/report";

const router = express.Router();

router.post("/:floorId", generateReport);
export default router;
