import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.get('/', serviceController.getAllServices);

router.post('/', auth(UserRole.TECHNICIAN), serviceController.createService);

export const serviceRoute = router