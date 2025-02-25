export const addAnnotations = async (floorid: number, annotaions: []) => {
  try {
    const floorId = floorid;
    const finalAnnotations = annotaions.map((el) => {
      // @ts-ignore
      return { ...el, projectfloor: floorId };
    });
    console.log("final annotations", finalAnnotations);
  } catch {
    throw new Error("Error Adding Annotations");
  }
};
