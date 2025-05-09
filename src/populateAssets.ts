// /src/populateAssets.ts
import prisma from "./db";
import * as fs from "fs";
import * as path from "path";

async function main() {
  try {
    const dataPath = path.join(__dirname, "..", "vastu_data.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const jsonData = JSON.parse(rawData);

    for (const assetName in jsonData) {
      if (Object.prototype.hasOwnProperty.call(jsonData, assetName)) {
        const assetInfoArray = jsonData[assetName];

        // Create the asset in the Assets table
        await prisma.assets.create({
          data: {
            asset_name: assetName,
          },
        });

        console.log(`Inserted asset: ${assetName}`);

        // Insert the asset data into the AssetData table
        for (const assetData of assetInfoArray) {
          await prisma.assetData.create({
            data: {
              asset_name: assetName,
              direction: assetData.Direction,
              impact: assetData.Impacts || "",
              remedy: assetData.Remedies || "", // Handle optional remedy
            },
          });
          console.log(
            `Inserted data for ${assetName}, Direction: ${assetData.Direction}`
          );
        }
      }
    }

    console.log("Data insertion complete.");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // No need to disconnect here, as it's handled in the main function.
  });
