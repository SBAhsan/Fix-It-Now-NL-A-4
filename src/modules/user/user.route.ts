import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get('/technician', userController.getAllProfiles);

router.get('/technician/:id', userController.getSingleProfile);

export const userRoute = router;