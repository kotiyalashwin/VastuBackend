import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  userSignUpSchema,
  userSignInSchema,
} from "../validations/userValidations";
import { generateToken, setCookie } from "../utils/tokenUtils";
import { authRequest } from "../middleware/authmiddleware";

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET as string;

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;

    if (!body) {
      // Send the response and return immediately
      res.json({ err: "Invalid Request" });
      return;
    }

    const { success } = userSignUpSchema.safeParse(body);

    if (!success) {
      res.json({ err: "Invalid Inputs" });
      return;
    }

    // Hash the password before saving
    const hashedpass = await bcrypt.hash(body.password, 10);

    // Create a new user in the database
    const user = await prisma.user.create({
      select: {
        id: true,
      },
      data: {
        name: body.name,
        email: body.email,
        password: hashedpass,
        ...(body.phone && { phone: body.phone }),
      },
    });

    // Generate a JWT token for the new user
    const token = generateToken(user.id);

    // Set the token in the response cookie
    setCookie(res, token);

    // Send success message
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
    // Check if the user exists and if they are active
    const user = await prisma.user.findUnique({
      where: { email: body.email, active: true },
    });

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    // Compare the provided password with the stored hash
    const passwordValid = await bcrypt.compare(body.password, user.password);
    if (!passwordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate a JWT token for the user
    const token = generateToken(user.id);

    // Set the token in the response cookie
    setCookie(res, token);

    // Send success message
    res.status(200).json({ message: "Success" });
  } catch (e) {
    console.error("Sign-in error:", e);
    res.status(500).json({ message: "An error occurred during sign-in" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear the token cookie upon logout
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in production
      sameSite: "lax",
    });
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
    const userId = req.userId || false;

    if (!userId) {
      res.json({
        isAuthenticated: false,
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      res.json({
        isAuthenticated: false,
      });
      return;
    }

    res.json({
      username: user.name,
      isAuthenticated: true,
    });
  } catch (e) {
    console.error("Session error:", e);
    res.status(500).json({
      error: `Unable to verify : ${e}`,
    });
  }
};
