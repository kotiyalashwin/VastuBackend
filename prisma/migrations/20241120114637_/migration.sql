/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `User` table. All the data in the column will be lost.
  - The required column `account_id` was added to the `Account` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_id_fkey";

-- DropForeignKey
ALTER TABLE "Consultant" DROP CONSTRAINT "Consultant_accountId_fkey";

-- DropIndex
DROP INDEX "Account_email_key";

-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "password",
DROP COLUMN "phone",
ADD COLUMN     "account_id" TEXT NOT NULL,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("account_id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountId";

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "account_user_fkey" FOREIGN KEY ("account_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "account_consultant_fkey" FOREIGN KEY ("account_id") REFERENCES "Consultant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
