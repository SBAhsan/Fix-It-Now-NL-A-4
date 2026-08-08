import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { paymentController } from "./payment.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createPaymentSchema } from "./payment.validation";

const router = Router();

router.post("/create", auth(UserRole.CUSTOMER), validateRequest(createPaymentSchema), paymentController.createCheckoutSession);

export const paymentRoute = router;