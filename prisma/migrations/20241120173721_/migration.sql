/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[consultantId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `consultantId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "account_consultant_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "account_user_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "consultantId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_consultantId_key" ON "Account"("consultantId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "account_user_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "account_consultant_fkey" FOREIGN KEY ("consultantId") REFERENCES "Consultant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
