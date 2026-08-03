import { Router } from "express";
import { technicianController } from "./technician.controller";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post('/create-profile', auth(UserRole.TECHNICIAN), technicianController.createTechnicianProfile)

export const technicianRoute = router;