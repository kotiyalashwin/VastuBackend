import Zod from "zod";

export const AccountSignUpSchema = Zod.object({
  name: Zod.string(),
  email: Zod.string().email(),
  phone: Zod.string().optional(),
  password: Zod.string().min(6),
  role: Zod.string(),
});

export const userSignInSchema = Zod.object({
  email: Zod.string().email(),
  password: Zod.string().min(6),
});

export const forgotPassSchema = Zod.object({
  email: Zod.string().email("Enter a Valid Email"),
});

export const resetPassSchema = Zod.object({
  password: Zod.string().min(6),
  token: Zod.string(),
  userId: Zod.string(),
});

export type signUpInput = Zod.infer<typeof AccountSignUpSchema>;
