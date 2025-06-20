import express from "express";
import authmiddleware, { authRequest } from "../middleware/authmiddleware";
import {
  signUp,
  signIn,
  getSession,
  logout,
  forgotPassword,
  resetPassword,
} from "../controller/userController";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout", authmiddleware, logout);

router.get("/session", authmiddleware, getSession);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
