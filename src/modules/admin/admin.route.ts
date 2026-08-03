import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post('/categories', auth(UserRole.ADMIN), adminController.createCategory);

router.get('/categories', auth(UserRole.ADMIN), adminController.getAllCategories);

router.get('/users', auth(UserRole.ADMIN), adminController.getAllUsers);

export const adminRoute = router;