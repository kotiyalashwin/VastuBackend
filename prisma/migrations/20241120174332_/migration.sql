/*
  Warnings:

  - You are about to drop the column `email` on the `Consultant` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Consultant` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Consultant` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueId` on the `Consultant` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "account_consultant_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "account_user_fkey";

-- DropIndex
DROP INDEX "Account_consultantId_key";

-- DropIndex
DROP INDEX "Account_userId_key";

-- DropIndex
DROP INDEX "Consultant_email_key";

-- DropIndex
DROP INDEX "Consultant_uniqueId_key";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL,
ALTER COLUMN "consultantId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Consultant" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "phone",
DROP COLUMN "uniqueId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "phone";

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "Consultant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
