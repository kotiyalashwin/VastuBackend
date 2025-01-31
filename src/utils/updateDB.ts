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
        id: Number(floorId),
      },
      data: {
        annotated_img: type === "annotated" ? link : "",
        marked_img: type === "marked" ? link : "",
        modified: role === "CONSULTANT", // if consultant then modified is TRUE
      },
    });

    return;
  } catch (error) {
    // console.log(error);
    throw new Error(`Unable to update ${type} image requested by ${role}`);
  }
};

export default updateDB;
