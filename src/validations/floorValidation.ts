import { string, z } from "zod";

const newRoom = z.object({});

export const newFloorSchema = z.object({
  floorNumber: z.number(),
  description: z.string().optional(),
  rawImg: z.string().url(),
  markedImg: z.string().url(),
  annotatedImg: z.string().url().optional(),
  room: newRoom.array(),
});

export type newFloorEntities = z.infer<typeof newFloorSchema>;
