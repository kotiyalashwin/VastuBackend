/*
  Warnings:

  - You are about to drop the column `reportId` on the `ProjectFloor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectFloor" DROP COLUMN "reportId",
ADD COLUMN     "report" JSONB;
