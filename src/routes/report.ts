import express from "express";
import { allReport, generateReport, setReport } from "../controller/report";

const router = express.Router();

router.post("/genreport/:floorId", generateReport);
router.put("/submitreport/:floorId", setReport);
router.get("/projectreport/:projectId", allReport);
export default router;
