import { z } from "zod";

export const newFloorSchema = z.object({
  floorNumber: z.number(),
  description: z.string().optional(),
  floorPlan: z.string().url(),
});

export type newFloorEntities = z.infer<typeof newFloorSchema>;
