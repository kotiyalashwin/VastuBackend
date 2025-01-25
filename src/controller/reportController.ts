import { Response } from "express";
import { authRequest } from "../middleware/authmiddleware";

import { reportDataSchema } from "../validations/reportValidation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
