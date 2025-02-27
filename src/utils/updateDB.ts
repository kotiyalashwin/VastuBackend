import prisma from "../db";

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
        user_marked_img: true,
        user_annotated_img: true,
        final_annotated_img: true,
        final_marked_img: true,
        marked_compass_angle: type === "marked",
        marked_indicator_angle: type === "marked",
      },
    });

    const isMarked = type === "marked";
    const userField = isMarked ? "user_marked_img" : "user_annotated_img";
    const finalField = isMarked ? "final_marked_img" : "final_annotated_img";

    await prisma.projectFloor.update({
      where: {
        id: Number(floorId),
      },
      data: {
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
        modified: role === "CONSULTANT", // if consultant then modified is TRUE

        //if user then store new otherwise prev
        [userField]: role === "USER" ? link : previousData?.[userField],

        //if consultant then store new OR if user then see if prev if not then store new
        [finalField]:
          role === "CONSULTANT" ? link : previousData?.[finalField] ?? link,
      },
    });
    return;
  } catch (error) {
    // console.log(error);
    throw new Error(`Unable to update ${type} image requested by ${role}`);
  }
};

export default updateDB;
