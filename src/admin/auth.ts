import { Request, Response } from "express";
import prisma from "../db";
import bcrypt from "bcryptjs";
import { userSignInSchema } from "../validations/userValidations";
import {
  generateToken,
  setRoleCookie,
  setTokenCookie,
} from "../utils/tokenUtils";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { success, data } = userSignInSchema.safeParse(req.body);

    if (!success) {
      res.status(300).json({ message: "Invalid Login" });
      return;
    }
    const { email, password } = data;

    const exist = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!exist) {
      res.status(404).json({ message: "No admin found" });
      return;
    }

    const isValid = await bcrypt.compare(password, exist.password);

    if (!isValid) {
      res.status(403).json({ message: "Invalid Credentials" });
      return;
    }
    const token = generateToken(exist.id);
    const role = generateToken("ADMIN");
    setTokenCookie(res, token);
    setRoleCookie(res, role);
    res.json({ message: "Welcome to vastu.com" });
  } catch (e) {
    res.status(500).json({
      message: "Unable to login at the moment",
      isAuthenticated: true,
    });
  }
};
