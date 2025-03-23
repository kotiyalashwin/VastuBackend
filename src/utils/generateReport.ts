import e = require("express");
import fs from "fs";
import path = require("path");

type annotations = {
  roomtype: string;
  direction: string;
  description: string;
};

const vastuData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../vastu_data.json"), "utf8")
);
export const GenerateReport = async (annotaions: annotations[]) => {
  try {
    if (annotaions.length === 0) {
      throw new Error();
    }

    const report = annotaions.map((el) => {
      const { roomtype, direction } = el;
      if (!roomtype || !direction) {
        throw new Error();
      }

      const roomData = vastuData[roomtype.toString().toLowerCase()];
      if (!roomData) {
        throw new Error();
      }
      const vastuEntry = roomData.find(
        (entry: any) => entry.Direction === direction
      );
      if (!vastuEntry) {
        throw new Error();
      }
      return {
        room: el.roomtype,
        direction: el.direction,
        description: el.description,
        impact: vastuEntry.Impacts || "No impact data available",
        remedy: vastuEntry.Remedies || "No remedy data available",
      };
    });

    return report;
  } catch {
    return null;
  }
};
