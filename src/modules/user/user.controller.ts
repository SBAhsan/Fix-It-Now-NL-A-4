import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { getPackedSettings } from "node:http2";

const getAllProfiles = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const profiles = await userService.getAllProfileFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Retrieved all the profiles successfully",
        data: profiles
    })
});

const getSingleProfile = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const profileId = req.params.id;

    const result = await userService.getSingleProfileFromDB(profileId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile retrieved successfully",
        data: result
    })
});


export const userController = {
    getAllProfiles,
    getSingleProfile
}