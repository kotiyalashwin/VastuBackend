import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function NewProjectNumber(userId: number) {
  const oldproject = await prisma.project.findFirst({
    where: { userId: userId },
    orderBy: { projectnumber: "desc" },
  });

  const newProjectNumber = oldproject ? oldproject.projectnumber + 1 : 1;

  return newProjectNumber;
}
