-- CreateTable
CREATE TABLE "Assets" (
    "asset_name" TEXT NOT NULL,

    CONSTRAINT "Assets_pkey" PRIMARY KEY ("asset_name")
);

-- CreateTable
CREATE TABLE "AssetData" (
    "id" SERIAL NOT NULL,
    "asset_name" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "remedy" TEXT,
    "impact" TEXT,

    CONSTRAINT "AssetData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assets_asset_name_key" ON "Assets"("asset_name");

-- CreateIndex
CREATE UNIQUE INDEX "AssetData_asset_name_direction_key" ON "AssetData"("asset_name", "direction");

-- AddForeignKey
ALTER TABLE "AssetData" ADD CONSTRAINT "AssetData_asset_name_fkey" FOREIGN KEY ("asset_name") REFERENCES "Assets"("asset_name") ON DELETE RESTRICT ON UPDATE CASCADE;
