import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createServiceSchema, serviceQuerySchema } from "./service.validation";

const router = Router();

router.get('/', validateRequest(createServiceSchema), serviceController.getAllServices);

router.post('/', auth(UserRole.TECHNICIAN), validateRequest(serviceQuerySchema), serviceController.createService);

export const serviceRoute = router