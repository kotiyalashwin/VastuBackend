/*
  Warnings:

  - You are about to drop the column `floorplan` on the `ProjectFloor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NEW', 'SUBMITTED', 'REVIEWING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "ProjectFloor" DROP COLUMN "floorplan",
ADD COLUMN     "annotated_img" TEXT,
ADD COLUMN     "marked_img" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "raw_img" TEXT NOT NULL DEFAULT '';
