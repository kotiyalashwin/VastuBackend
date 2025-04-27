-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_consultantId_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Annotations" DROP CONSTRAINT "Annotations_projectfloor_fkey";

-- DropForeignKey
ALTER TABLE "AssetData" DROP CONSTRAINT "AssetData_asset_name_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_consultantId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "Consultant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "Consultant"("uniqueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotations" ADD CONSTRAINT "Annotations_projectfloor_fkey" FOREIGN KEY ("projectfloor") REFERENCES "ProjectFloor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetData" ADD CONSTRAINT "AssetData_asset_name_fkey" FOREIGN KEY ("asset_name") REFERENCES "Assets"("asset_name") ON DELETE CASCADE ON UPDATE CASCADE;
