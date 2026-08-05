import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();

router.post('/', auth(UserRole.CUSTOMER), reviewController.createCustomerReview);

export const reviewRoute = router;