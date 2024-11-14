/*
  Warnings:

  - A unique constraint covering the columns `[projectnumber]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectnumber` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "projectnumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectnumber_key" ON "Project"("projectnumber");
