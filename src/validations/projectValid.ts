import Zod from "zod";

export const newProjectSchema = Zod.object({
  name: Zod.string(),
  type: Zod.string(),
  floorcount: Zod.number(),
  address: Zod.string(),
  consultantid: Zod.string().optional(),
});
