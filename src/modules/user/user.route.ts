import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { technicianQuerySchema } from "./user.validation";

const router = Router();

router.get('/technician', validateRequest(technicianQuerySchema), userController.getAllProfiles);

router.get('/technician/:id', userController.getSingleProfile);

export const userRoute = router;