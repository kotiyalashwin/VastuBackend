-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_consultantId_fkey";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "Consultant"("uniqueId") ON DELETE SET NULL ON UPDATE CASCADE;
