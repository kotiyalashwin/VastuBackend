/*
  Warnings:

  - You are about to drop the column `annotated_img` on the `ProjectFloor` table. All the data in the column will be lost.
  - You are about to drop the column `marked_img` on the `ProjectFloor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectFloor" DROP COLUMN "annotated_img",
DROP COLUMN "marked_img",
ADD COLUMN     "final_annotated_img" TEXT DEFAULT '',
ADD COLUMN     "final_marked_img" TEXT DEFAULT '',
ADD COLUMN     "user_annotated_img" TEXT DEFAULT '',
ADD COLUMN     "user_marked_img" TEXT DEFAULT '';
