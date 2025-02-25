import { PrismaClient } from "@prisma/client";
import prisma from "../db";

export async function NewProjectNumber(userId: String) {
  const oldproject = await prisma.project.findFirst({
    where: { userId: userId as string },
    orderBy: { projectnumber: "desc" },
    include: { user: true },
  });

  const newProjectNumber = oldproject ? oldproject.projectnumber + 1 : 1;

  return newProjectNumber;
}
