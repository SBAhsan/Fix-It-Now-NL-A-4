import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCheckoutSession = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const {bookingId} = req.body;

    const result = await paymentService.createCheckoutSessionInDB(customerId as string, bookingId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Payment session created successfully",
        data: result
    })
})

const webhook = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["stripe-signature"];

    if(!signature) {
        throw new AppError(404, "Missing stripe-signature header", '')
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            config.stripe_webhook_secret as string
        )
    } catch (error) {
        throw new AppError (400, "Invalid webhook signature", '')
    }


    await paymentService.handleWebhookEvent(event)

    res.status(200).json({
        received: true
    })
})


const getPaymentHistory = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;

    const result = await paymentService.getPaymentHistoryFromDB(customerId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment history retrieved successfully",
        data: result
    })
})

const getPaymentHistoryById = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const paymentId = req.params.id;

    const result = await paymentService.getPaymentHistoryByIdFromDB(customerId as string, paymentId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `Payment history of payment id ${paymentId} retrieved successfully`,
        data: result
    })
})

export const paymentController = {
    createCheckoutSession,
    webhook,
    getPaymentHistory,
    getPaymentHistoryById
}