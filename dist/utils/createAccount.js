"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const consultantUniqueId_1 = require("./consultantUniqueId");
const tokenUtils_1 = require("./tokenUtils");
const prisma = new client_1.PrismaClient();
const createAccount = (body, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const { email } = body.email;
    const existing = yield prisma.account?.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      res.json({
        error: "User Alreaddy Exist",
      });
      return;
    }
    //passwordHash
    const hashedpass = yield bcrypt_1.default.hash(body.password, 10);
    if (body.role === "USER") {
      const account = yield prisma.account.create({
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
      const account = yield prisma.account.create({
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
      if (
        (_a = account.consultant) === null || _a === void 0 ? void 0 : _a.id
      ) {
        const uniqueId = (0, consultantUniqueId_1.generateUniqueId)(
          account.consultant.name.slice(0, 3)
        );
        // Update the consultant with uniqueId
        yield prisma.consultant.update({
          where: { id: account.consultant.id },
          data: { uniqueId },
        });
        const uid = (0, tokenUtils_1.generateToken)(uniqueId);
        (0, tokenUtils_1.setUIDCookie)(res, uid);
        return account;
      } else {
        throw new Error("Consultant ID is null or undefined.");
      }
    }
  });
exports.createAccount = createAccount;
