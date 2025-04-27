/*
  Warnings:

  - You are about to drop the column `status` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "ProjectFloor" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NEW';
