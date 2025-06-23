import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    const role = req.cookies?.role as string;
    console.log(token);
    if (!token || !role) {
      res.status(403).json({
        message: "token or role cookie absent",
        isAuthenticated: false,
      });
      return;
    }

    //token present
    const decodedRole = jwt.verify(role, process.env.JWT_SECRET as string);
    console.log("role decodeed");
    console.log(decodedRole);

    const isAdmin = (decodedRole as { userId: string }).userId === "ADMIN";
    if (!isAdmin) {
      res
        .status(403)
        .json({ message: "Not Authorised", isAuthenticated: false });
      return;
    }
    next();
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Unable to authenticate", isAuthenticated: false });
  }
};
