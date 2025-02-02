import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updateDB = async (
  type: "marked" | "annotated",
  link: string,
  role: "USER" | "CONSULTANT",
  floorId: number,
  marked_compass_angle: number,
  marked_indicator_angle: number
) => {
  try {
    const previousData = await prisma.projectFloor.findUnique({
      where: { id: Number(floorId) },
      select: {
        annotated_img: true,
        marked_img: true,
        marked_compass_angle: true,
      },
    });
    await prisma.projectFloor.update({
      where: {
        id: Number(floorId),
      },
      data: {
        marked_compass_angle:
          marked_compass_angle !== previousData?.marked_compass_angle
            ? marked_compass_angle
            : previousData.marked_compass_angle,
        annotated_img:
          type === "annotated" ? link : previousData?.annotated_img,
        marked_img: type === "marked" ? link : previousData?.marked_img,
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
