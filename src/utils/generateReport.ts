import e = require("express");
import fs from "fs";
import path = require("path");
import prisma from "../db";

// const vastuData = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "../../vastu_data.json"), "utf8")
// );

interface Annotation {
  roomtype: string;
  direction: string;
  description: string;
}

interface ReportEntry {
  room: string;
  direction: string;
  description: string;
  impact: string;
  remedy: string | null;
}

export const GenerateReport = async (
  annotations: Annotation[]
): Promise<ReportEntry[] | null> => {
  try {
    if (annotations.length === 0) {
      throw new Error("Annotations array is empty.");
    }

    const roomDirections = annotations.map(({ roomtype, direction }) => ({
      roomType: roomtype.toLowerCase(),
      direction: direction,
    }));

    const assetDataList = await prisma.assetData.findMany({
      where: {
        OR: roomDirections.map(({ roomType, direction }) => ({
          asset_name: roomType,
          direction: direction,
        })),
      },
      select: {
        asset_name: true,
        direction: true,
        impact: true,
        remedy: true,
      },
    });

    const report = annotations.map(({ roomtype, direction, description }) => {
      const foundData = assetDataList.find(
        (data) =>
          data.asset_name === roomtype.toLowerCase() &&
          data.direction === direction
      );

      return {
        room: roomtype,
        direction: direction,
        description: description,
        impact: foundData?.impact || "No impact data available",
        remedy: foundData?.remedy || "No remedy data available",
      };
    });

    return report;
  } catch (error) {
    console.error("Error generating report:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
// export const GenerateReport = async (annotaions: annotations[]) => {
//   try {
//     if (annotaions.length === 0) {
//       throw new Error();
//     }

//     const report = annotaions.map(async(el) => {
//       const { roomtype, direction } = el;
//       if (!roomtype || !direction) {
//         throw new Error();
//       }
//       const assets = await getAssets();

//       // const roomData = vastuData[roomtype.toString().toLowerCase()];
//       if (!assets) {
//         throw new Error();
//       }

//       const data = await prisma.assetData.fin
//       const vastuEntry = roomData.find(
//         (entry: any) => entry.Direction === direction
//       );
//       if (!vastuEntry) {
//         throw new Error();
//       }
//       return {
//         room: el.roomtype,
//         direction: el.direction,
//         description: el.description,
//         impact: vastuEntry.Impacts || "No impact data available",
//         remedy: vastuEntry.Remedies || "No remedy data available",
//       };
//     });

//     return report;
//   } catch {
//     return null;
//   }
// };
