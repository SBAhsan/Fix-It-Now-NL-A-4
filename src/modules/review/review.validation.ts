import z, { positive } from "zod";
import { positiveNumber, uuidField } from "../../common/validationHelpers";

export const createCustomerReviewSchema = z.object({
    body: z.object({
    bookingId: uuidField,
    rating: positiveNumber.int().min(1, "Minimum rating is 1").max(5, "Maximum rating is 5"),
    comment: z.string().optional(),
  })
})