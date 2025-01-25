import { Response, Request } from "express";
import { authRequest } from "../middleware/authmiddleware";
import { UploadedFile } from "express-fileupload";
import { uploadImageToCloudinary } from "../utils/cloudinaryulpoad";
import { PrismaClient } from "@prisma/client";
import {
  newFloorEntities,
  newFloorSchema,
} from "../validations/floorValidation";

const prisma = new PrismaClient();

export const imageUpload = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // console.log(req.body);
    const { userName, projectName, floorNum } = req.body;
    // console.log(req.files);

    if (!req.files || !req.files.image) {
      res.status(400).json({ message: "File is required" });
      return;
    }
    const file = req.files.image as UploadedFile | UploadedFile[];
    // console.log(file);

    if (!userName || !projectName || !file) {
      res
        .status(400)
        .json({ message: "Username, projectname, and file are required" });
      return;
    }

    const imageBuffer = Array.isArray(file)
      ? file[0].data
      : (file as UploadedFile).data;

    const folderPath = `LocalVastu/${userName}/${projectName}/${floorNum}`;

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
    const body: newFloorEntities = req.body;
    // console.log(body);
    const projectId = req.params.id;
    const { success } = newFloorSchema.safeParse(body);

    if (!success) {
      res.status(500).json({
        error: "Invalid Inputs",
      });
      return;
    }

    const { rawImg, markedImg, floorNumber, annotatedImg, description, rooms } =
      body;

    // console.log(rooms);

    // try {
    await prisma.projectFloor.create({
      data: {
        floornumber: floorNumber,
        raw_img: rawImg,
        marked_img: markedImg,
        description: description,
        annotated_img: annotatedImg,
        projectId: Number(projectId),
        annotations: rooms, //null
      },
    });

    await prisma.project.update({
      where: { id: Number(projectId) },
      data: {
        status: "SUBMITTED",
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
    const projectId = Number(req.params.projectId);

    if (!projectId) {
      res.status(401).json({
        message: "Unauthorized Request. Please Login/SignUp",
      });
      return;
    }

    prisma.projectFloor
      .findMany({
        where: {
          projectId: projectId,
        },
      })
      .then((data) => {
        if (!data) {
          res.status(500).json({
            message: "No floor plans Found for this project",
          });
          return;
        }

        res.json(data); // floorId
      });

    // if (!floorPlans) {
    //   res.status(500).json({
    //     message: "No floor plans Found for this project",
    //   });
    //   return;
    // }

    // res.status(200).json({
    //   floorPlans,
    // });
  } catch (e) {
    console.error("Error retreiving floorplan:", e);
    res.status(500).json({
      message: "Error finding floorplan",
    });
  }
};
