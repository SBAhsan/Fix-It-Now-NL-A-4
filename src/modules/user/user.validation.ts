import z from "zod";

export const technicianQuerySchema = z.object({
  query: z.object({
    city: z.string().optional(),
    skill: z.string().optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    searchTerm: z.string().optional(),
  }),
});