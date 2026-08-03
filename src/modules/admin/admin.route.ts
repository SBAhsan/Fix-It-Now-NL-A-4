import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post('/categories', auth(UserRole.ADMIN), adminController.createCategory);

export const adminRoute = router;