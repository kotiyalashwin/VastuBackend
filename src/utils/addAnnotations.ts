import prisma from "../db";

export const addAnnotations = async (floorid: number, annotaions: []) => {
  try {
    const floorId = floorid;
    const finalAnnotations = annotaions.map((el) => {
      // @ts-ignore
      return { ...el, projectfloor: floorId };
    });
    console.log("final annotations", finalAnnotations);

    // TODO -> Insert this array in the db in a single call
    await prisma.annotations.createMany({
      data: finalAnnotations,
    });
  } catch {
    throw new Error("Error Adding Annotations");
  }
};
