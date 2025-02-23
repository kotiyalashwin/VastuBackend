import { PrismaClient } from "@prisma/client";

export const addAnnotations = async (
  floorid: number,
  annotaions: [],
  prisma: PrismaClient
) => {
  try {
    const floorId = floorid;
    const finalAnnotations = annotaions.map((el) => {
      //@ts-ignore
      return { ...el, projectfloor: floorId };
    });
    await prisma.annotations.createMany({
      data: finalAnnotations,
    });
  } catch {
    throw new Error("Error Adding Annotations");
  }
};
