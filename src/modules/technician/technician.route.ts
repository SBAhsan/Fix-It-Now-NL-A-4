import { Router } from "express";
import { technicianController } from "./technician.controller";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { createAvailabilitySlotSchema, createTechnicianProfileSchema, updateAvailabilitySlotSchema, updateBookingStatusSchema } from "./technician.validation";

const router = Router();

router.post('/create-profile', auth(UserRole.TECHNICIAN), validateRequest(createTechnicianProfileSchema), technicianController.createTechnicianProfile);

router.post('/availability', auth(UserRole.TECHNICIAN), validateRequest(createAvailabilitySlotSchema), technicianController.createAvailabilitySlot);

router.get('/availability', auth(UserRole.TECHNICIAN), technicianController.getAllSlots);

router.put('/availability', auth(UserRole.TECHNICIAN), validateRequest(updateAvailabilitySlotSchema), technicianController.updateSlot);

router.get('/bookings', auth(UserRole.TECHNICIAN), technicianController.getMyAllBookings);

router.get('/services', auth(UserRole.TECHNICIAN), technicianController.getAllServices);

router.get('/reviews', auth(UserRole.TECHNICIAN), technicianController.getAllReviewsOnMe);

router.delete('/', auth(UserRole.TECHNICIAN), technicianController.deleteOwnProfile);

router.patch('/bookings/:id', auth(UserRole.TECHNICIAN), validateRequest(updateBookingStatusSchema), technicianController.updateBookingStatus);

router.get('/bookings/:id', auth(UserRole.TECHNICIAN), technicianController.getMyBookingById)


export const technicianRoute = router;