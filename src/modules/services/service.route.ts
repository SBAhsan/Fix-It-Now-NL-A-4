import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createServiceSchema, serviceQuerySchema } from "./service.validation";

const router = Router();

router.get('/', validateRequest(serviceQuerySchema), serviceController.getAllServices);

router.post('/', auth(UserRole.TECHNICIAN), validateRequest(createServiceSchema), serviceController.createService);

export const serviceRoute = router