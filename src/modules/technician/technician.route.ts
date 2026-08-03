import { Router } from "express";
import { technicianController } from "./technician.controller";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post('/create-profile', auth(UserRole.TECHNICIAN), technicianController.createTechnicianProfile);

router.get('/', technicianController.getAllProfiles);

router.get('/:id', technicianController.getSingleProfile);

router.delete('/', auth(UserRole.TECHNICIAN), technicianController.deleteOwnProfile);

router.delete('/:id', auth(UserRole.ADMIN), technicianController.deleteTechnicianProfile);

export const technicianRoute = router;