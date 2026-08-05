import { Router } from "express";
import { technicianController } from "./technician.controller";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post('/create-profile', auth(UserRole.TECHNICIAN), technicianController.createTechnicianProfile);

router.get('/', technicianController.getAllProfiles);

router.post('/availability', auth(UserRole.TECHNICIAN), technicianController.createAvailabilitySlot);

router.get('/availability', auth(UserRole.TECHNICIAN), technicianController.getAllSlots);

router.put('/availability', auth(UserRole.TECHNICIAN), technicianController.updateSlot);

router.get('/bookings', auth(UserRole.TECHNICIAN), technicianController.getAllBookings);

router.post('/create-service', auth(UserRole.TECHNICIAN), technicianController.createService);

router.get('/services', auth(UserRole.TECHNICIAN), technicianController.getAllServices);

router.get('/reviews', auth(UserRole.TECHNICIAN), technicianController.getAllReviewsOnMe);

router.delete('/', auth(UserRole.TECHNICIAN), technicianController.deleteOwnProfile);

router.patch('/bookings/:id', auth(UserRole.TECHNICIAN), technicianController.updateBookingStatus);

router.get('/:id', technicianController.getSingleProfile);


export const technicianRoute = router;