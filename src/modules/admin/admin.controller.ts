import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCategory = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await adminService.createCategoryInDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: result
    });
})


const getAllCategories = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllCategoriesInDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Retrieved all the categories successfully",
        data: result
    })
})

const getAllServices = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllServicesFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All the services retrieved successfully",
        data: result
    })
})

const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUserFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Retrieved all the users successfully",
        data: result
    })
})

const updateUser = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;

    const result = await adminService.updateUserFromDB(userId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User updated successfully",
        data: result
    })
})


const deleteTechnicianProfile = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const profileId = req.params.id;

    const result = await adminService.deleteTechnicianProfileInDB(profileId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile deleted successfully",
        data: result
    })
})

export const adminController = {
    createCategory,
    getAllCategories,
    getAllServices,
    getAllUsers,
    updateUser,
    deleteTechnicianProfile
}