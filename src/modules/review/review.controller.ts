import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCustomerReview = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const payload = req.body;

    const review = await reviewService.createCustomerReviewInDB(customerId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review created successfully",
        data: review
    });
});

const getReviewOnIndividualTechnician = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.params.id;

    const result = await reviewService.getReviewOnIndividualTechnicianFromDB(technicianId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Review retrieved successfully",
        data: result
    });
})


export const reviewController = {
    createCustomerReview,
    getReviewOnIndividualTechnician
}