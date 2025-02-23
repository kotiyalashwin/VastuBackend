/*
  Warnings:

  - Added the required column `end` to the `Annotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `Annotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orientation` to the `Annotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Annotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Annotations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Annotations" ADD COLUMN     "end" INTEGER NOT NULL,
ADD COLUMN     "note" TEXT NOT NULL,
ADD COLUMN     "orientation" TEXT NOT NULL,
ADD COLUMN     "start" INTEGER NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;
