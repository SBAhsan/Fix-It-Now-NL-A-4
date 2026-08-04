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

const getAllProfiles = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const profiles = await technicianService.getAllProfileFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Retrieved all the profiles successfully",
        data: profiles
    })
})

const getSingleProfile = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const profileId = req.params.id;

    const result = await technicianService.getSingleProfileFromDB(profileId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile retrieved successfully",
        data: result
    })
})

const createService = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await technicianService.createServiceInDB(userId as string, payload);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Service created successfully",
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

    console.log("The user id: ", userId);

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

const getAllBookings = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await technicianService.getAllBookingsFromDB(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All of your bookings retrieved successfully",
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
    getAllProfiles,
    getSingleProfile,
    createService,
    getAllServices,
    createAvailabilitySlot,
    getAllSlots,
    updateSlot,
    getAllBookings,
    deleteOwnProfile
}