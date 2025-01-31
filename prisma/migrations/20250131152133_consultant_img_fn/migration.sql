-- AlterTable
ALTER TABLE "ProjectFloor" ADD COLUMN     "modified" BOOLEAN DEFAULT false,
ALTER COLUMN "floornumber" DROP NOT NULL,
ALTER COLUMN "marked_img" DROP NOT NULL,
ALTER COLUMN "raw_img" DROP NOT NULL;
