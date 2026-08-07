import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { reviewController } from "./review.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createCustomerReviewSchema } from "./review.validation";

const router = Router();

router.post('/', auth(UserRole.CUSTOMER), validateRequest(createCustomerReviewSchema), reviewController.createCustomerReview);

router.get('/technician/:id', reviewController.getReviewOnIndividualTechnician);

export const reviewRoute = router;