"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccount = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const CreateAccount = (role, body) => __awaiter(void 0, void 0, void 0, function* () {
    let account;
    yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        account = yield tx.account.create({
            data: Object.assign(Object.assign({ role: role }, (role === "USER" && {
                user: {
                    create: {
                        email: body.email,
                    },
                },
            })), (role === "CONSULTANT" && {
                consultant: {
                    create: {
                        email: body.email,
                    },
                },
            })),
        });
    }));
});
exports.CreateAccount = CreateAccount;