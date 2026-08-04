import { Router } from "express";
import { bookingController } from "./bookings.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post('/', auth(UserRole.CUSTOMER), bookingController.createBooking);

export const bookingRoute = router;