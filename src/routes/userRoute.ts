import express from "express";
import authmiddleware, { authRequest } from "../middleware/authmiddleware";
import {
  getSession,
  logout,
  signIn,
  signUp,
} from "../controller/userController";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout", authmiddleware, logout);

router.get("/session", authmiddleware, getSession);

export default router;
