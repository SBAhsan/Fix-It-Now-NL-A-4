import z from "zod";
import {
  nonEmptyString,
  positiveNumber,
  uuidField,
} from "../../common/validationHelpers";

export const createBookingSchema = z.object({
  body: z.object({
    technicianId: uuidField,
    slotId: uuidField,
    scheduledDate: z.coerce.date(),
    scheduledTime: z.coerce.date(),
    workAddress: nonEmptyString,
    totalAmount: positiveNumber,
  }),
});
