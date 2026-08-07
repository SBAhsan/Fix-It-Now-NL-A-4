import z from "zod";
import { nonEmptyString, positiveNumber, uuidField } from "../../common/validationHelpers";

export const createServiceSchema = z.object({
  body: z.object({
    title: nonEmptyString,
    description: z.string().optional(),
    price: positiveNumber,
    isActive: z.boolean().optional().default(true),
    categoryId: uuidField,
  }),
});

export const serviceQuerySchema = z.object({
  query: z.object({
    type: z.string().optional(),
    location: z.string().optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
    searchTerm: z.string().optional(),
  }),
});
