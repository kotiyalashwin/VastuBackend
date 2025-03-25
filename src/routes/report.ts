import express from "express";
import { generateReport, setReport } from "../controller/report";

const router = express.Router();

router.post("/genreport/:floorId", generateReport);
router.put("/submitreport/:floorId", setReport);
export default router;
