import { Response, Request } from "express";
import { authRequest } from "../middleware/authmiddleware";
import { UploadedFile } from "express-fileupload";
import { uploadImageToCloudinary } from "../utils/cloudinaryulpoad";

import {
  newFloorEntities,
  newFloorSchema,
} from "../validations/floorValidation";
import { PrismaClient } from "@prisma/client";
import updateDB from "../utils/updateDB";
import { addAnnotations } from "../utils/addAnnotations";
import prisma from "../db";

//TODO: Add Zod Validations for this function
export const imageUpload = async (
  req: authRequest,
  res: Response
): Promise<void> => {
  try {
    const { userName, projectName, floorNum, description, type } = req.body;
    const { projectId } = req.params;
    const { marked_compass_angle, marked_indicator_angle } = req.body || null;
    const floorId = req.body.floorId || null;
    const role = req.role;

    if (!req.files || !req.files.image) {
      res.status(400).json({ message: "File is required" });
      return;
    }
    const file = req.files.image as UploadedFile | UploadedFile[];

    if (!userName || !projectName || !file || !projectId || !type) {
      res.status(400).json({ message: "Invalid Request" });
      return;
    }

    const imageBuffer = Array.isArray(file)
      ? file[0].data
      : (file as UploadedFile).data;

    const folderPath = `LocalVastu/${userName}/${projectName}/${floorNum}`;

    const uploadResult = await uploadImageToCloudinary(imageBuffer, folderPath);

    console.log(type);
    //add functioning for consultant and user seperate
    if (type === "raw") {
      //create raw for newFloor with raw_img url
      const floorId = await prisma.projectFloor.create({
        data: {
          floornumber: Number(floorNum),
          description: description,
          raw_img: uploadResult.result.url,
          projectId: Number(projectId),
        },
        //return floorId
        select: {
          id: true,
        },
      });

      res.status(200).json({
        floorId: floorId,
        message: "Image uploaded successfully",
        imageURL: uploadResult.result,
      });
      return;
    } else {
      let rooms;
      if (type === "annotated") {
        console.log("Uploading Annotated Image...");
        rooms = JSON.parse(req.body.rooms);
        console.log(rooms);
        addAnnotations(Number(floorId), rooms);
      }
      //IF not RAW
      if (!uploadResult) {
        res.status(400).json({
          message: "Some error occured",
        });
      }

      //if requested by consultant
      if (role === "CONSULTANT") {
        //type === 'marked' | 'annotated'
        await updateDB(
          type,
          uploadResult.result.url,
          "CONSULTANT",
          floorId,
          marked_compass_angle,
          marked_indicator_angle
        );
        res.status(200).json({
          message: `${type} image updated successfully`,
        });
        return;
      }

      //if requested by user
      await updateDB(
        type,
        uploadResult.result.url,
        "USER",
        floorId,
        marked_compass_angle,
        marked_indicator_angle
      );
      res.status(200).json({
        message: `${type} image uploaded successfully`,
      });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(403).json({
      message: "Error Uploading Image",
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
        //res.status(200)
      });
  } catch (e) {
    console.error("Error retreiving floorplan:", e);
    res.status(500).json({
      message: "Error finding floorplan",
    });
  }
};

export const getFloorDetails = async (req: authRequest, res: Response) => {
  try {
    const floorId = req.params.floorid;

    const report = await prisma.projectFloor.findUnique({
      where: {
        id: Number(floorId),
      },
      select: {
        report: true,
      },
    });

    res.json(report);
  } catch {
    res.status(400).json({
      message: "Unable to get details for the floor plan",
    });
  }
};

export const getAnnotations = async (req: Request, res: Response) => {
  try {
    const { floorId } = req.params;

    if (!floorId) {
      res.status(503).json({
        message: "Floor is Required",
      });
      return;
    }

    const prev_annotatios = await prisma.projectFloor.findUnique({
      where: {
        id: Number(floorId),
      },
      select: {
        annotations: true,
      },
    });

    if (!prev_annotatios) {
      res.status(503).json({
        message: "Unable to fetch annotaions",
      });
      return;
    }

    res.status(200).json({
      annotations: prev_annotatios,
    });
  } catch (e) {
    console.error(e);
  }
};
