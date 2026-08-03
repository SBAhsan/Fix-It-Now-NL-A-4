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

export const adminController = {
    createCategory,
    getAllCategories,
    getAllUsers,
    updateUser
}