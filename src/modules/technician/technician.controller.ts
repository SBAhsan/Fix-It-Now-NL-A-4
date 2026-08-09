import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { technicianService } from "./technician.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createTechnicianProfile = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await technicianService.createTechnicianProfileInDB(userId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Profile created successfully",
        data: result
    })
});


const getAllServices = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const result = await technicianService.getAllServicesFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All the services retrieved successfully",
        data: result
    })
})

const createAvailabilitySlot = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await technicianService.createAvailableSlotInDB(userId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Created available slot successfully",
        data: result
    })
})

const getAllSlots = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id;

    const result = await technicianService.getAllSlotsFromDB(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All the slots retrieved successfully",
        data: result
    })
})

const updateSlot = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await technicianService.updateSlotInDB(userId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Updated slot successfully",
        data: result
    })
})

const getMyAllBookings = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await technicianService.getMyAllBookingsFromDB(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All of your bookings retrieved successfully",
        data: result
    })
});

const getMyBookingById = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const bookingId = req.params.id;

    const booking = await technicianService.getMyBookingByIdFromDB(userId as string, bookingId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking retrieved successfully",
        data: booking
    })
})

const updateBookingStatus = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const bookingId = req.params.id;
    const payload = req.body;

    const result = await technicianService.updateBookingStatusInDB(userId as string, bookingId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking status edited successfully",
        data: result
    })
})

const getAllReviewsOnMe = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await technicianService.getAllReviewsOnMeFromDB(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reviews retrieved successfully",
        data: result
    })
})

const deleteOwnProfile = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await technicianService.deleteOwnProfileInDB(userId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile deleted successfully",
        data: result
    })
})



export const technicianController = {
    createTechnicianProfile,
    getAllServices,
    createAvailabilitySlot,
    getAllSlots,
    updateSlot,
    getMyAllBookings,
    getMyBookingById,
    updateBookingStatus,
    getAllReviewsOnMe,
    deleteOwnProfile
}