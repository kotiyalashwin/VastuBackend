import { PrismaClient } from "@prisma/client";
import { newProjectSchema } from "../validations/projectValid";
import { NewProjectNumber } from "../utils/projectNumber";
import { Response } from "express";
import { authRequest } from "../middleware/authmiddleware";

const prisma = new PrismaClient();

// Create Project
export const createProject = async (
  req: authRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId as string; // From auth middleware
  const body = req.body;
  const role = req.role;

  if (role === "CONSULTANT") {
    res.status(403).json({
      message: "A consultant cannot create new projects",
    });
    return;
  }

  const { success } = newProjectSchema.safeParse(body);

  try {
    if (!success) {
      res.status(500).json({ message: "Invalid Inputs" });
      return;
    }

    // console.log(body.consultantid);

    if (body.consultantid) {
      const consultant = await prisma.consultant.findUnique({
        where: {
          uniqueId: body.consultantid,
        },
      });

      // console.log(consultant);

      if (!consultant) {
        res.status(404).json({
          error: "No consultant for this Id",
        });
        return;
      }
    }

    const newProjectNumber = await NewProjectNumber(userId);
    // const newProjectNumber = 10;
    const project = await prisma.project.create({
      data: {
        name: body.name,
        type: body.type,
        numFloors: body.floorcount,
        address: body.address,
        userId: userId,
        projectnumber: newProjectNumber,
        ...(body.consultantid && { consultantId: body.consultantid }),
      },
      select: {
        name: true,
        id: true,
      },
    });

    res.json({
      message: `Project ${project.name} created successfully`,
      id: project.id,
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
  const userID = String(req.userId); // From auth middleware
  const role = req.role;

  try {
    if (!userID || !role) {
      res.json({ message: "Invalid User" });
      return;
    }

    if (role === "USER") {
      const project = await prisma.project.findMany({
        where: {
          userId: userID,
        },
      });
      if (!project) {
        res.status(500).json({
          message: "No project found",
        });
        return;
      }

      res.json(project);
    } else if (role === "CONSULTANT") {
      const project = await prisma.project.findMany({
        where: {
          consultant: {
            id: userID,
          },
        },
      });
      if (!project) {
        res.status(500).json({
          message: "No project found",
        });
        return;
      }

      res.json(project);
    }
  } catch (e) {
    console.error("Error Retrieving Projects:", e);
    res.status(500).json({ message: "Error in Projects Route" });
  }
};

export const selectForReview = async (req: authRequest, res: Response) => {
  try {
    const projectId = Number(req.params.projectId);
    const consUID = req.consUID;

    if (!projectId) {
      res.status(500).json({
        message: "project Id is required",
      });
      return;
    }

    // console.log(consUID);
    if (!consUID) {
      res.status(403).json({
        message: "Not a Valid User/Consultant ID invalid",
      });
      return;
    }

    await prisma.project.update({
      where: { id: projectId, consultantId: consUID },
      data: { status: "REVIEWING" },
    });

    res.status(200).json({
      message: "Successfully selected project for review",
    });
  } catch (e) {
    res.status(500).json({
      message: "Unable to Select For review",
    });
  }
};

export const deleteProject = async (req: authRequest, res: Response) => {
  try {
    const projectId = Number(req.params.projectId);

    if (req.role === "CONSULTANT") {
      throw new Error("UnAuthorized");
    }

    const projectExist = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!projectExist) {
      throw new Error("No such project");
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    res.json({
      message: "Project Deleted Successfully",
    });
  } catch (e) {
    throw new Error("Error Deleting Project");
  }
};
