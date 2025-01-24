import { string, z } from "zod";

const newRoom = z.object({
  angle: z.number(),
  height: z.number(),
  note: z.string(),
  orentation: z.string(),
  startX: z.number(),
  startY: z.number(),
  text: z.string(),
  width: z.number(),
});

export const newFloorSchema = z.object({
  floorNumber: z.number(),
  description: z.string().optional(),
  rawImg: z.string().url(),
  markedImg: z.string().url(),
  annotatedImg: z.string().url().optional(),
  room: z.array(newRoom).optional(),
});

export type newFloorEntities = z.infer<typeof newFloorSchema>;
