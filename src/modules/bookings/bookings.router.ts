import { Router } from "express";
import { bookingController } from "./bookings.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createBookingSchema } from "./bookings.validation";

const router = Router();

router.post('/', auth(UserRole.CUSTOMER), validateRequest(createBookingSchema), bookingController.createBooking);

export const bookingRoute = router;