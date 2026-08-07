import z from "zod";
import { nonEmptyString } from "../../common/validationHelpers";

const createCategorySchema = z.object({
    body: z.object({
        name: nonEmptyString,
        isActive: z.boolean().optional()
    })
})

export const categoryValidation = {
    createCategorySchema
}