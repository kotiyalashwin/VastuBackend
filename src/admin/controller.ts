import prisma from "../db";
import express from "express";
import { Request, Response } from "express";
export const router = express.Router();

router.put("/addcons/:consid", async (req: Request, res: Response) => {
  try {
    const consId = req.params.consid || null;
    const pId = req.query.pId;

    if (!pId) {
      res.status(404).json({
        message: "Project ID required",
      });
      return;
    }

    if (!consId) {
      res.status(503).json({
        message: "Consultant ID required",
      });
      return;
    }
    const cons = await prisma.consultant.findFirst({
      where: {
        uniqueId: consId,
      },
    });

    if (!cons) {
      res.status(404).json({
        message: "No Consultant found",
      });
      return;
    }

    await prisma.project.update({
      where: {
        id: Number(pId),
      },
      data: {
        consultantId: consId,
      },
    });

    res.json({ message: "Consultant added successfully" });
  } catch {
    res.status(503).json({
      message: "Unable to add consultant",
    });
  }
});

router.get("/noconsproject", async (_req: Request, res: Response) => {
  try {
    const noconsproj = await prisma.project.findMany({
      where: {
        consultantId: null,
      },
    });
    res.json(noconsproj);
  } catch (e) {
    console.log(e);
    res.status(503).json({ message: "Unable to get projects" });
  }
});
