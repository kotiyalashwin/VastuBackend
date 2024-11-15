import { Response } from "express";
import { authRequest } from "../middleware/authmiddleware";
import { UploadedFile } from "express-fileupload";
import { uploadImageToCloudinary } from "../utils/cloudinaryulpoad";
import { PrismaClient } from "@prisma/client";
import { newFloorSchema } from "../validations/floorValidation";
const prisma = new PrismaClient();

export const imageUpload = async (
  req: authRequest,
  res: Response
): Promise<void> => {
  try {
    console.log(req.body);
    const { userName, projectName } = req.body;
    // console.log(req.files);

    if (!req.files || !req.files.image) {
      res.status(400).json({ message: "File is required" });
      return;
    }
    const file = req.files.image as UploadedFile | UploadedFile[];
    console.log(file);

    if (!userName || !projectName || !file) {
      res
        .status(400)
        .json({ message: "Username, projectname, and file are required" });
      return;
    }

    const imageBuffer = Array.isArray(file)
      ? file[0].data
      : (file as UploadedFile).data;

    const folderPath = `VastuProject/${userName}/${projectName}`;

    const uploadResult = await uploadImageToCloudinary(imageBuffer, folderPath);

    res.status(200).json({
      message: "Image uploaded successfully",
      imageURL: uploadResult.result,
    });
    // console.log(uploadResult.url);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      message: "Error uploading image",
    });
  }
};

export const newFloor = async (
  req: authRequest,
  res: Response
): Promise<void> => {
  try {
    const body = req.body;
    const projectId = Number(req.params.id);
    const { success } = newFloorSchema.safeParse(body);

    if (!success) {
      res.status(500).json({
        error: "Invalid Inputs",
      });
      return;
    }

    const { floorNumber, floorPlan, description } = body;

    const newFloor = await prisma.projectFloor.create({
      data: {
        floornumber: floorNumber,
        floorplan: floorPlan,
        description: description,
        projectId: projectId,
      },
    });

    res.status(200).json({
      message: "Floor Plan added successfully",
    });
  } catch (e) {
    console.error("Error creating new floorplan:", e);
    res.status(500).json({
      message: "Error creating new floorplan",
    });
  }
};

export const getFloorPlans = async (
  req: authRequest,
  res: Response
): Promise<void> => {
  try {
    const projectId = Number(req.projectId);

    if (!projectId) {
      res.status(401).json({
        message: "Unauthorized Request. Please Login/SignUp",
      });
      return;
    }

    const floorPlans = prisma.projectFloor.findMany({
      where: {
        projectId: projectId,
      },
      select: {
        floornumber: true,
        floorplan: true,
      },
    });

    if (!floorPlans) {
      res.status(500).json({
        message: "No floor plans Found for this project",
      });
      return;
    }

    res.status(200).json({
      floorPlans,
    });
  } catch (e) {
    console.error("Error retreiving floorplan:", e);
    res.status(500).json({
      message: "Error finding floorplan",
    });
  }
};
