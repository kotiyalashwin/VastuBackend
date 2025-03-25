import prisma from "../db";
export async function getAssets() {
  try {
    const assets = await prisma.assets.findMany({
      select: {
        asset_name: true,
      },
    });
    console.log(assets);

    if (!assets) {
      return null;
    }
    return assets.map((obj) => obj.asset_name);
  } catch {
    return null;
  }
}
