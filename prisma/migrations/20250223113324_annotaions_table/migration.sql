/*
  Warnings:

  - You are about to drop the column `annotations` on the `ProjectFloor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectFloor" DROP COLUMN "annotations";

-- CreateTable
CREATE TABLE "Annotations" (
    "id" SERIAL NOT NULL,
    "projectfloor" INTEGER NOT NULL,

    CONSTRAINT "Annotations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Annotations" ADD CONSTRAINT "Annotations_projectfloor_fkey" FOREIGN KEY ("projectfloor") REFERENCES "ProjectFloor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
