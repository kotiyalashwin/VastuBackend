import { z } from "zod";

const reportSchema = z.object({
  roomname: z.string(),
  remark: z.string(),
  remedy: z.string(),
});

export const reportDataSchema = z.object({
  reports: z.array(reportSchema),
});

export type reportData = z.infer<typeof reportDataSchema>;
