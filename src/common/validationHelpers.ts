import z from "zod";

export const uuidField = z.string().uuid("Invalid id format");
export const positiveNumber = z.number().positive("Value must be a positive number");
export const nonEmptyString = z.string().min(1, "This field is required");