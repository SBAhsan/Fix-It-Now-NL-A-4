import { Router } from "express";
import { technicianController } from "./technician.controller";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post('/create-profile', auth(UserRole.TECHNICIAN), technicianController.createTechnicianProfile);

router.get('/', technicianController.getAllProfiles);

router.post('/availability', auth(UserRole.TECHNICIAN), technicianController.createAvailabilitySlot);

router.get('/availability', auth(UserRole.TECHNICIAN), technicianController.getAllSlots);

router.put('/availability', auth(UserRole.TECHNICIAN), technicianController.updateSlot)

router.get('/:id', technicianController.getSingleProfile);

router.post('/create-service', auth(UserRole.TECHNICIAN), technicianController.createService);

router.get('/services', auth(UserRole.TECHNICIAN), technicianController.getAllServices);

router.delete('/', auth(UserRole.TECHNICIAN), technicianController.deleteOwnProfile);


export const technicianRoute = router;