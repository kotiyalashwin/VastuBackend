import express from "express";
import prisma from "../db";

export const adminRouter = express.Router();

adminRouter.get("/projects", async (req, res) => {
  try {
    const noconsproj = await prisma.project.findMany({
      where: {
        consultantId: null,
      },
    });
    res.json(noconsproj);
  } catch {
    res.status(201).json({ message: "Unable to get projects" });
  }
});

adminRouter.put("/addcons/:consid", async (req, res) => {
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
      res.status(201).json({
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
    res.status(201).json({
      message: "Unable to add consultant",
    });
  }
});
