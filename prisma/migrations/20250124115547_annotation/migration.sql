/*
  Warnings:

  - Added the required column `annotations` to the `ProjectFloor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectFloor" ADD COLUMN     "annotations" JSONB NOT NULL;
