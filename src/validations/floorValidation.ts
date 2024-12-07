import { z } from "zod";

export const newFloorSchema = z.object({
  floorNumber: z.number(),
  description: z.string().optional(),
  rawImg: z.string().url(),
  markedImg: z.string().url(),
  annotatedImg: z.string().url().optional(),
});

export type newFloorEntities = z.infer<typeof newFloorSchema>;
