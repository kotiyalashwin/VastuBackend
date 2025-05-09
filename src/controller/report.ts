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
    await prisma.projectFloor.update({
      where: {
        id: Number(floorId),
      },
      data: {
        status: "REVIEWING",
      },
    });

    if (!report) {
      throw new Error();
    }

    res.json(report);
  } catch {
    res.status(201).json({
      message: "Unable to generate report",
    });
  }
};

export const setReport = async (req: Request, res: Response) => {
  try {
    const floorId = req.params.floorId;
    if (!floorId) {
      res.status(201).json({
        message: "Floor id required in params",
      });
      return;
    }

    const finalReport = req.body.report;
    // ARRAY of these objects
    // {
    // room
    // direction
    // description
    // remedy
    // impact
    // }

    await prisma.projectFloor
      .update({
        where: {
          id: Number(floorId),
        },
        data: {
          report: finalReport,
          status: "COMPLETED",
        },
      })
      .then(async () => {
        res.json({
          message: "Final Report Submitted",
        });
      })
      .catch(() => {
        res.status(201).json({
          message: "Unable to update final report",
        });
        return;
      });
  } catch {
    res.status(201).json({
      message: "Unable to update final report",
    });
  }
};

export const allReport = async (req: Request, res: Response) => {
  const projectId = req.params.projectId || null;

  if (!projectId) {
    res.status(201).json({ message: "No Project Found" });
    return;
  }

  const allreport = await prisma.project.findUnique({
    where: {
      id: Number(projectId),
    },
    select: {
      // numFloors: true,
      floors: {
        select: {
          floornumber: true,
          report: true,
        },
      },
    },
  });

  const data = allreport?.floors;

  if (!data) {
    res.status(201).json({ message: "Unable to get Report" });
  }
  res.json(data);
};
