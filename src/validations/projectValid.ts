import { z } from "zod";

export const newProjectSchema = z.object({
  name: z.string(),
  type: z.string(),
  floorcount: z.number(),
  address: z.string(),
  consultantid: z.string().optional().nullable(),
});
