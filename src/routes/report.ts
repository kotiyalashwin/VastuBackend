import express from "express";
import { generateReport } from "../controller/report";

const router = express.Router();

router.post("/", generateReport);
export default router;
