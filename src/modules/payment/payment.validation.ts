import z from "zod";
import { uuidField } from "../../common/validationHelpers";
import { PaymentProvider } from "../../../prisma/generated/prisma/enums";

export const createPaymentSchema = z.object({
    body: z.object({
        bookingId: uuidField,
        provider: z.enum(PaymentProvider)
    })
})