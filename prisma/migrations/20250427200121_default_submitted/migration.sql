/*
  Warnings:

  - The values [NEW] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('SUBMITTED', 'REVIEWING', 'COMPLETED');
ALTER TABLE "ProjectFloor" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ProjectFloor" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "ProjectFloor" ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';
COMMIT;

-- AlterTable
ALTER TABLE "ProjectFloor" ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';
