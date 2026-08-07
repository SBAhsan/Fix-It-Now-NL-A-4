import z from "zod";
import { nonEmptyString } from "../../common/validationHelpers";
import { UserRole } from "../../../prisma/generated/prisma/enums";

export const registerUserSchema = z.object({
  body: z.object({
    name: nonEmptyString,
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: nonEmptyString,
    role: z.enum(UserRole).optional(),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    password: nonEmptyString,
  }),
});