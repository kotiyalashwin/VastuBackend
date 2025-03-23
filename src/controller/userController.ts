import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  AccountSignUpSchema,
  userSignInSchema,
} from "../validations/userValidations";
import {
  generateToken,
  setRoleCookie,
  setTokenCookie,
  setUIDCookie,
} from "../utils/tokenUtils";
import { authRequest } from "../middleware/authmiddleware";
import { createAccount } from "../utils/createAccount";
import prisma from "../db";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;

    if (!body) {
      // Send the response and return immediately
      res.status(201).json({ err: "Invalid Request" });
      return;
    }

    const { success } = AccountSignUpSchema.safeParse(body);

    if (!success) {
      res.json({ err: "Invalid Inputs" });
      return;
    }

    const account = await createAccount(body, res);

    try {
      if (account?.role === "USER" && account.userId) {
        const role = generateToken(account.role);
        const token = generateToken(account.userId);
        setRoleCookie(res, role);
        setTokenCookie(res, token);
      } else if (account?.role === "CONSULTANT" && account.consultantId) {
        const role = generateToken(account.role);
        const token = generateToken(account.consultantId);
        setRoleCookie(res, role);
        setTokenCookie(res, token);
      }
    } catch {
      res.status(500).json({
        msg: "Unable to add new user",
      });
      return;
    }
    res.status(200).json({
      message: "User created successfully",
    });
  } catch (e) {
    console.error(e);
    // Handle any errors and send failure response
    res.status(500).json({
      msg: "Unable to add new user",
    });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;

  const { success } = userSignInSchema.safeParse(body);

  if (!success) {
    res.status(401).json({
      msg: "Invalid Inputs",
    });
    return;
  }

  try {
    const account = await prisma.account.findUnique({
      where: {
        email: body.email,
      },
      include: { user: true, consultant: true },
    });

    if (!account) {
      res.status(404).json({
        message: "No Account for this Id",
      });
      return;
    }

    if (account?.role === "USER" && account.user) {
      const passwordValid = await bcrypt.compare(
        body.password,
        account.user?.password
      );
      if (!passwordValid) {
        res.status(401).json({
          message: "Invalid Credentials",
        });
        return;
      }
      const role = generateToken(account.role);
      const token = generateToken(account.user.id);
      setRoleCookie(res, role);
      setTokenCookie(res, token);
      res.status(200).json({ message: "Success" });
      return;
    } else if (account?.role === "CONSULTANT" && account.consultant) {
      const passwordValid = await bcrypt.compare(
        body.password,
        account.consultant?.password
      );
      if (!passwordValid) {
        res.status(401).json({
          message: "Invalid Credentials",
        });
        return;
      }
      const role = generateToken(account.role);
      const token = generateToken(account.consultant.id);
      const uid = generateToken(account.consultant.uniqueId);
      setRoleCookie(res, role);
      setTokenCookie(res, token);
      setUIDCookie(res, uid);
      res.status(200).json({ message: "Success" });
    }

    // Send success message
  } catch (e) {
    console.error("Sign-in error:", e);
    res.status(500).json({ message: "An error occurred during sign-in" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in production
      sameSite: "none",
    });

    res.clearCookie("role", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    if (req.cookies?.uid) {
      res.clearCookie("uid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
    }

    res.json({ message: "Logged out successfully" });
  } catch (e) {
    console.error("Logout error:", e);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};

export const getSession = async (
  req: authRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const role = req.role;

    if (!userId || !role) {
      res.json({
        message: "session error : userId or role not in reques",
        isAuthenticated: false,
      });
      return;
    }
    if (role === "USER") {
      const account = await prisma.account.findFirst({
        where: { userId: userId as string },
        include: { user: true, consultant: true },
      });

      if (!account || !role) {
        res.json({
          isAuthenticated: false,
        });
        return;
      }

      res.json({
        username: account.name,
        userRole: account.role,
        isAuthenticated: true,
      });
    } else if (role === "CONSULTANT") {
      const account = await prisma.account.findFirst({
        where: { consultantId: userId as string },
        include: { user: true, consultant: true },
      });

      if (!account || !role) {
        res.json({
          isAuthenticated: false,
        });
        return;
      }

      res.json({
        username: account.name,
        userRole: account.role,
        isAuthenticated: true,
      });
    }
  } catch (e) {
    // console.error("Session error:", e);
    res.json({
      error: `Unable to verify : ${e}`,
    });
  }
};
