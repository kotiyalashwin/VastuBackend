import { Response } from "express";
import { authRequest } from "../middleware/authmiddleware";

import { reportDataSchema } from "../validations/reportValidation";
import prisma from "../db";

export const addReport = async (req: authRequest, res: Response) => {
  try {
    const floorid = Number(req.params.floorId);
    const { success } = reportDataSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        message: "Invalid Inputs",
      });
    }

    await prisma.projectFloor.update({
      where: {
        id: floorid,
      },
      data: {
        report: req.body,
      },
    });

    res.json({
      message: "Successfully added report",
    });
  } catch {
    res.status(400).json({
      message: "Error Occurred",
    });
  }
};

export const getReport = async (req: authRequest, res: Response) => {
  try {
    const floorid = Number(req.params.floorId);

    const report = await prisma.projectFloor.findUnique({
      where: {
        id: floorid,
      },
      select: {
        report: true,
      },
    });

    res.json(report);
  } catch {
    res.status(400).json({
      message: "Error Occurred",
    });
  }
};
