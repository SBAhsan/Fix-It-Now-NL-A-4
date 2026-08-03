import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.get('/me', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.TECHNICIAN), authController.getMe)

export const authRoute = router;