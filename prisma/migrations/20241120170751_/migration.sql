/*
  Warnings:

  - A unique constraint covering the columns `[uniqueId]` on the table `Consultant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Consultant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Consultant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Consultant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consultant" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "uniqueId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Consultant_uniqueId_key" ON "Consultant"("uniqueId");
