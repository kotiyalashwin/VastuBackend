import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import {
  AccountSignUpSchema,
  forgotPassSchema,
  resetPassSchema,
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
import crypto from "crypto";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;

    if (!body) {
      // Send the response and return immediately
      res.status(503).json({ err: "Invalid Request" });
      return;
    }

    const { success } = AccountSignUpSchema.safeParse(body);

    if (!success) {
      res.status(503).json({ err: "Invalid Inputs" });
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
      message: "Invalid Inputs",
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
      res.status(403).json({
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
        uniqueCode: account.consultantId,
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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { success } = forgotPassSchema.safeParse(req.body);

    if (!success) {
      res.status(300).json({ message: "Enter a valid email" });
      return;
    }

    const { email } = req.body;

    const exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!exist) {
      res.status(404).json({ message: "User not Found" });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(rawToken, 10);
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); //1hour

    await prisma.user.update({
      where: {
        id: exist.id,
      },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: tokenExpiry,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}&id=${exist.id}`;

    const transporter = nodemailer.createTransport({
      // host: "smtp.ethereal.email",
      // port: 587,
      // secure: false, // true for 465, false for other ports
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.GOOGLE_APP_MAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_APP_MAIL,
      to: exist.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a target='_blank_' href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Unable to Reset-Password" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { success, data } = resetPassSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({ message: "Try again." });
      return;
    }

    const { password: newPassword, token, userId } = data;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        resetTokenExpiry: {
          gt: new Date(), // Check if token is not expired
        },
      },
    });

    if (!user || !user.resetToken) {
      res
        .status(400)
        .json({ message: "Invalid or expired password reset token." });

      return;
    }

    const isTokenValid = await bcrypt.compare(token, user.resetToken);

    if (!isTokenValid) {
      res
        .status(400)
        .json({ message: "Invalid or expired password reset token." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiry: null,
      },
    });

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (e) {
    console.log(e);
    res.status(400).json("Unable to reset password");
  }
};
