import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface authRequest extends Request {
  userId?: String | boolean;
  projectId?: String;
}

const authmiddleware = (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    //token not present
    if (!token) {
      res.status(401).json({
        message: "Unauthorized: No token provided",
      });

      res.json({
        isAuthenticated: false,
      });
      return;
    }

    //token present

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = (decoded as { userId: string }).userId;

    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
};

export default authmiddleware;
