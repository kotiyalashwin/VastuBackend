import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Response } from "express";
import { generateUniqueId } from "./consultantUniqueId";
import { generateToken, setUIDCookie } from "./tokenUtils";

const prisma = new PrismaClient();

export const createAccount = async (body: any, res: Response) => {
  // const { email } = body.email;
  const existing = await prisma.account.findUnique({
    where: { email: body.email },
  });

  if (existing) {
    res.json({
      error: "User Alreaddy Exist",
    });
    return;
  }

  //passwordHash
  const hashedpass = await bcrypt.hash(body.password, 10);

  if (body.role === "USER") {
    const account = await prisma.account.create({
      data: {
        role: body.role,
        email: body.email,
        name: body.name,
        user: {
          create: {
            name: body.name,
            password: hashedpass,
            email: body.email,
          },
        },
      },
    });

    return account;
  }

  if (body.role === "CONSULTANT") {
    const account = await prisma.account.create({
      data: {
        role: body.role,
        email: body.email,
        name: body.name,
        consultant: {
          create: {
            name: body.name,
            password: hashedpass,
            email: body.email,
          },
        },
      },
      include: {
        consultant: true,
      },
    });

    if (account.consultant?.id) {
      const uniqueId = generateUniqueId(account.consultant.name.slice(0, 3));

      // Update the consultant with uniqueId
      await prisma.consultant.update({
        where: { id: account.consultant.id },
        data: { uniqueId },
      });

      const uid = generateToken(uniqueId);
      setUIDCookie(res, uid);

      return account;
    } else {
      throw new Error("Consultant ID is null or undefined.");
    }
  }
};
