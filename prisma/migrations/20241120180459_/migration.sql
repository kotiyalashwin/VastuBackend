/*
  Warnings:

  - A unique constraint covering the columns `[uniqueId]` on the table `Consultant` will be added. If there are existing duplicate values, this will fail.
  - The required column `uniqueId` was added to the `Consultant` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Consultant" ADD COLUMN     "uniqueId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Consultant_uniqueId_key" ON "Consultant"("uniqueId");
