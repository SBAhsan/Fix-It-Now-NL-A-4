import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { serviceService } from "./service.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";



const getAllServices = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const result = await serviceService.getAllServicesFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Retrieved all the services successfully",
        data: result
    })
})

export const serviceController = {
    getAllServices
}