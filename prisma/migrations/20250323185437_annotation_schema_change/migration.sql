/*
  Warnings:

  - Added the required column `height` to the `Annotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startX` to the `Annotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startY` to the `Annotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Annotations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Annotations" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "startX" INTEGER NOT NULL,
ADD COLUMN     "startY" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;
