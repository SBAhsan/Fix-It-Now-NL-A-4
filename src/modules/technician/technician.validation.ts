import z from "zod";
import { nonEmptyString, positiveNumber } from "../../common/validationHelpers";
import { BookingStatus } from "../../../prisma/generated/prisma/enums";

export const createTechnicianProfileSchema = z.object({
    body: z.object({
        bio: z.string().optional(),
        skills: z.array(nonEmptyString).min(1, "Minimum one skill required"),
        experienceYears: positiveNumber.int().default(0),
        city: nonEmptyString
    })
});



export const createAvailabilitySlotSchema = z.object({
  body: z.object({
    slotDate: z.coerce.date(),
    slotTime: z.coerce.date(),
  }),
});

export const updateAvailabilitySlotSchema = z.object({
  body: z.object({
    slotDate: z.coerce.date(),
    slotTime: z.coerce.date(),
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(BookingStatus),
  }),
});

