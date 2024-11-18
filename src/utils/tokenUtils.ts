import { Response } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;

// Function to generate JWT token
export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, secret, { expiresIn: "1h" }); // Set expiration time to 1 hour
};

// Function to set JWT token in cookies
export const setCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only true in production
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  console.log("Cookie Sent:", res.getHeaders()["set-cookie"]);
};

// Function to clear the cookie on logout
export const clearCookie = (res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
};
