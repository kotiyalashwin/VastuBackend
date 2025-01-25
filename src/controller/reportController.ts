import { Response } from "express";
import { authRequest } from "../middleware/authmiddleware";
import { reportData, reportDataSchema } from "../validations/reportValidation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addReport = async (req: authRequest, res: Response) => {
  try {
    const body: reportData = req.body;
    const floorId = req.params.floorId;
    const { success } = reportDataSchema.safeParse(body);

    if (!success) {
      res.status(400).json({
        message: "Invalid Inputs",
      });
    }

    await prisma.projectFloor.update({
      where: {
        id: Number(floorId),
      },
      data: {
        report: body,
      },
    });
  } catch {
    res.status(400).json({
      message: "Some Error Occurred",
    });
  }
};
