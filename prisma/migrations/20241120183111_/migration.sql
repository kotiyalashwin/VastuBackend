/*
  Warnings:

  - You are about to drop the column `password` on the `Account` table. All the data in the column will be lost.
  - Added the required column `email` to the `Consultant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Consultant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "Consultant" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;
