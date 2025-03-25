import { Request, Response } from "express";
import { getAssets as fetchAssets } from "../utils/getAssets";
export const getAssets = async (req: Request, res: Response) => {
  try {
    const assets = await fetchAssets();

    if (!assets) {
      res.status(201).json({
        message: "No Assets Available",
      });
      return;
    }

    res.json(assets);
  } catch {
    res.status(201).json({
      message: "Unable to get Available Assets",
    });
  }
};
