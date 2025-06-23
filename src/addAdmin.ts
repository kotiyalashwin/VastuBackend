import dotenv from "dotenv";
dotenv.config();
import prisma from "./db";
import bcrypt from "bcryptjs";
async function main() {
  const rawPass = process.env.ADMIN_PASSWORD!;
  const hashedPass = await bcrypt.hash(rawPass, 10);
  const adminMail = process.env.GOOGLE_APP_MAIL!;
  const admin = await prisma.admin.create({
    data: {
      email: adminMail,
      password: hashedPass,
    },
  });
  console.log(admin);
}

main();
