import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updateDB = async (
  type: "marked" | "annotated",
  link: string,
  role: "USER" | "CONSULTANT",
  floorId: number,
  marked_compass_angle: number,
  marked_indicator_angle: number
  // parsedAnnotations: any
) => {
  try {
    const previousData = await prisma.projectFloor.findUnique({
      where: { id: Number(floorId) },
      select: {
        annotated_img: true,
        marked_img: true,
        marked_compass_angle: type === "marked",
        marked_indicator_angle: type === "marked",
      },
    });
    await prisma.projectFloor.update({
      where: {
        id: Number(floorId),
      },
      data: {
        // annotations: type === "annotated" ? parsedAnnotations : undefined,
        marked_compass_angle:
          type === "marked" &&
          marked_compass_angle !== previousData?.marked_compass_angle
            ? Number(marked_compass_angle)
            : previousData?.marked_compass_angle,
        marked_indicator_angle:
          type === "marked" &&
          marked_indicator_angle !== previousData?.marked_indicator_angle
            ? Number(marked_indicator_angle)
            : previousData?.marked_indicator_angle,
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
