import { Request, Response, NextFunction } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { authRequest } from "./authmiddleware";

const prisma = new PrismaClient();

export const projectMiddleware = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = String(req.userId); //consultant
  // const projectId = req.params.projectId;
  const role = req.role;
  const consUID = req.consUID; //consultant unique Id

  // if (!projectId) {
  //   res.status(400).json({ message: "Project ID is required" });
  //   return;
  // }

  if (role === "USER") {
    const project = await prisma.project.findFirst({
      where: { userId: userId },
    });
    if (!project) {
      res
        .status(403)
        .json({ message: "Access denied: Project not found or unauthorized" });
      return;
    }
  } else if (role === "CONSULTANT") {
    const project = await prisma.project.findFirst({
      where: { consultantId: consUID },
    });
    if (!project) {
      res
        .status(403)
        .json({ message: "Access denied: Project not found or unauthorized" });
      return;
    }
  }

  next();
};
