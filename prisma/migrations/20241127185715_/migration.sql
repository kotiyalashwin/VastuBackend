-- DropForeignKey
ALTER TABLE "ProjectFloor" DROP CONSTRAINT "ProjectFloor_projectId_fkey";

-- AddForeignKey
ALTER TABLE "ProjectFloor" ADD CONSTRAINT "ProjectFloor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
