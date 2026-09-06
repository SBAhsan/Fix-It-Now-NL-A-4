import z from "zod";
import { nonEmptyString } from "../../common/validationHelpers";
import { UserStatus } from "../../../prisma/generated/prisma/enums";

export const createCategorySchema = z.object({
    body: z.object({
        name: nonEmptyString,
        isActive: z.boolean().optional()
    })
})

export const updateUserStatusSchema = z.object({
    body: z.object({
        status: z.enum(UserStatus)
    })
})