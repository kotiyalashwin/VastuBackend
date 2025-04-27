import { Request, Response } from "express";
import { authRequest } from "../middleware/authmiddleware";
import prisma from "../db";

export const deleteUser = async (req: authRequest, res: Response) => {
  try {
    const role = req.role;
    const userId = req.userId as string;

    if (!role || !userId) {
      res.status(403).json({ message: "Not Authenticated to delete" });
      return;
    }

    if (role === "USER") {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } else {
      await prisma.consultant.delete({
        where: {
          id: userId,
        },
      });
    }
    res.json({ message: "Account deleted successfully" });
  } catch (e) {
    res
      .status(201)
      .json({ message: "Unable to delete account at this moment" });
  }
};
