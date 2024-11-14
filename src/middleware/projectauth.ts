import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { authRequest } from "./authmiddleware";

const prisma = new PrismaClient();

export const projectMiddleware = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = Number(req.userId);
  const projectId = req.params.projectId;

  if (!projectId) {
    res.status(400).json({ message: "Project ID is required" });
    return;
  }

  const project = await prisma.project.findFirst({
    where: { id: Number(projectId), userId: userId },
  });

  if (!project) {
    res
      .status(403)
      .json({ message: "Access denied: Project not found or unauthorized" });
    return;
  }

  req.projectId = projectId;
  next();
};
