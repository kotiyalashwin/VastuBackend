import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface authRequest extends Request {
  userId?: String;
  projectId?: String;
  role?: string;
  consUID?: string;
}

const authmiddleware = (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    const role = req.cookies?.role;

    // console.log(token);

    //token not present
    if (!token || !role) {
      // res.status(401).json({
      //   message: "Unauthorized: No token provided",
      // });
      res.json({
        message: "token or role cookie absent",
        isAuthenticated: false,
      });
      return;
    }

    //token present
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    const decodedRole = jwt.verify(role, process.env.JWT_SECRET as string);
    // get CONSUID from cookies
    if ((decodedRole as { userId: string }).userId === "CONSULTANT") {
      const consuid = req.cookies?.uid;

      const decodedUID = jwt.verify(consuid, process.env.JWT_SECRET as string);

      req.consUID = (decodedUID as { userId: string }).userId;
    }

    req.userId = (decodedToken as { userId: string }).userId;
    req.role = (decodedRole as { userId: string }).userId;

    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
};

export default authmiddleware;
