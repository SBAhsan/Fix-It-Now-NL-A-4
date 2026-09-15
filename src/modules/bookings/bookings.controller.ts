import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingService } from "./bookings.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createBooking = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const payload = req.body;

    const result = await bookingService.createBookingInDB(customerId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Booking created successfully!",
        data: result
    });
});


const getMyBookings = async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  const result = await bookingService.getMyBookingsFromDB(customerId as string);
  sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All the bookings retrieved successfully!",
        data: result
    });
};


export const bookingController = {
    createBooking,
    getMyBookings
}