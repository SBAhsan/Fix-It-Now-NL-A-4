import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import httpStatus from "http-status";
import { AppError } from "../utils/appError";
import { Prisma } from "../../prisma/generated/prisma/client";
import config from "../config";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode;
  let errorName = err.name || "Internal Server Error";
  let errorMessage = err.message || "Something went wrong";
  let errorDetails;

  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorDetails = "Validation Error";
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
    errorDetails = err.errorDetails;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorDetails = "You have provided incorrect field types or missing fields";
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorDetails = "Invalid query";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2001":
        statusCode = httpStatus.BAD_REQUEST;
        errorDetails =
          "The record searched for in the where condition does not exist";
        break;
      case "P2002":
        statusCode = httpStatus.BAD_REQUEST;
        errorDetails = "Unique constraint failed";
        break;
      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        errorDetails = "Foreign constraints failed";
        break;
      case "P2004":
        statusCode = httpStatus.BAD_REQUEST;
        errorDetails = "Constraint failed in the database";
        break;
      case "P2005":
        statusCode = httpStatus.BAD_REQUEST;
        errorDetails = "Invalid value for field's type";
        break;
      default:
        errorDetails = "Database request error";
    }
  }

  if (statusCode === 500 && config.node_env === "production") {
    errorDetails = null;
  } else if (
    config.node_env !== "production" &&
    err instanceof Error &&
    errorDetails === null
  ) {
    errorDetails = err.stack;
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: statusCode || "Internal Server Error",
    errorName: errorName,
    errorMessage: errorMessage,
    error: errorDetails,
  });
};
