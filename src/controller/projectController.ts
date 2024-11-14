import { PrismaClient } from "@prisma/client";
import { newProjectSchema } from "../validations/projectValid";
import { NewProjectNumber } from "../utils/projectNumber";
import { Request, Response } from "express";
import { authRequest } from "../middleware/authmiddleware";

const prisma = new PrismaClient();

// Create Project
export const createProject = async (
  req: authRequest,
  res: Response
): Promise<void> => {
  const userId = Number(req.userId); // From auth middleware
  const body = req.body;

  const { success } = newProjectSchema.safeParse(body);

  try {
    if (!success) {
      res.status(500).json({ message: "Invalid Inputs" });
      return;
    }

    const newProjectNumber = await NewProjectNumber(userId);
    const project = await prisma.project.create({
      data: {
        name: body.name,
        type: body.type,
        numFloors: body.floorcount,
        address: body.address,
        userId: userId,
        projectnumber: newProjectNumber,
      },
      select: {
        name: true,
      },
    });

    res.json({
      message: `Project ${project.name} created successfully`,
    });
  } catch (e) {
    console.error("Error creating new project:", e);
    res.status(500).json({
      message: "Error creating new project",
    });
  }
};

// Get Created Projects
export const getCreatedProjects = async (
  req: authRequest,
  res: Response
): Promise<void> => {
  const userID = Number(req.userId); // From auth middleware
  const projectnum = req.params.projectnum
    ? Number(req.params.projectnum)
    : undefined;

  try {
    if (!userID) {
      res.json({ message: "Invalid User" });
      return;
    }

    if (!projectnum) {
      const projects = await prisma.project.findMany({
        where: {
          userId: userID,
        },
      });
      res.json(projects);
      return;
    }

    const project = await prisma.project.findUnique({
      where: {
        projectnumber: projectnum,
        userId: userID,
      },
      select: {
        name: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
        numFloors: true,
      },
    });

    if (!project) {
      res.status(500).json({
        message: "No project found",
      });
      return;
    }

    res.json(project);
  } catch (e) {
    console.error("Error Retrieving Projects:", e);
    res.status(500).json({ message: "Error in Projects Route" });
  }
};
