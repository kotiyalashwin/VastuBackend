import { Request, Response } from "express";
import prisma from "../db/index";
import { GenerateReport } from "../utils/generateReport";

export const generateReport = async (req: Request, res: Response) => {
  try {
    const floorId = Number(req.params.floorId);
    const annotationsDB = await prisma.annotations.findMany({
      where: {
        projectfloor: Number(floorId),
      },
      select: {
        text: true,
        orientation: true,
        note: true,
      },
    });

    const annotations = annotationsDB.map((annotation) => ({
      roomtype: annotation.text,
      direction: annotation.orientation,
      description: annotation.note,
    }));

    const report = await GenerateReport(annotations);

    if (!report) {
      throw new Error();
    }
    await prisma.projectFloor.update({
      where: {
        id: floorId,
      },
      data: {
        report: report,
      },
    });

    res.json(report);
  } catch {
    res.status(201).json({
      message: "Unable to generate report",
    });
  }
};
