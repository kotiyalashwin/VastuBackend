import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updateDB = async (
  type: "marked" | "annotated",
  link: string,
  role: "USER" | "CONSULTANT",
  floorId: number
) => {
  try {
    await prisma.projectFloor.update({
      where: {
        id: floorId,
      },
      data: {
        annotated_img: type === "annotated" ? link : null,
        marked_img: type === "marked" ? link : null,
        modified: role === "CONSULTANT", // if consultant then modified is TRUE
      },
    });

    return;
  } catch {
    throw new Error(`Unable to update ${type} image requested by ${role}`);
  }
};

export default updateDB;
