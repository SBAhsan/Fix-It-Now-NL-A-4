import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createCategorySchema, updateUserStatusSchema } from "./admin.validation";

const router = Router();

router.post('/categories', auth(UserRole.ADMIN), validateRequest(createCategorySchema), adminController.createCategory);

router.get('/categories', auth(UserRole.ADMIN), adminController.getAllCategories);

router.get('/services', auth(UserRole.ADMIN), adminController.getAllServices);

router.get('/bookings', auth(UserRole.ADMIN), adminController.getAllBookings);

router.get('/users', auth(UserRole.ADMIN), adminController.getAllUsers);

router.patch('/users/:id', auth(UserRole.ADMIN), validateRequest(updateUserStatusSchema), adminController.updateUser);

router.delete('/technician/:id', auth(UserRole.ADMIN), adminController.deleteTechnicianProfile);

export const adminRoute = router;