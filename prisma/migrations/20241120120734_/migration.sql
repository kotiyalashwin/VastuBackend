/*
  Warnings:

  - You are about to drop the column `name` on the `Consultant` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Consultant` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Consultant` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueId` on the `Consultant` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Consultant_uniqueId_key";

-- AlterTable
ALTER TABLE "Consultant" DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "phone",
DROP COLUMN "uniqueId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "phone";
