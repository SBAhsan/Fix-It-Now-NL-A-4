import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsync(async(req:Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await authService.registerUserInDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: result
    })
});


const loginUser = catchAsync(async(req:Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const {accessToken, refreshToken} = await authService.loginUserInDB(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken
        }
    })
});

const refreshToken = catchAsync(async(req:Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const {accessToken} = await authService.refreshTokenInDB(refreshToken as string)

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Token refreshed successfully",
        data: {
            accessToken
        }
    })
})

const getMe = catchAsync(async(req:Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const user = await authService.getMeFromDB(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Retrieved user successfully",
        data: user
    });
})

export const authController = {
    registerUser,
    loginUser,
    refreshToken,
    getMe
}