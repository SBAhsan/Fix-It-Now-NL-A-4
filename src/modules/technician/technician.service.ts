import { prisma } from "../../lib/prisma";
import {
  ICreateAvailableSlotPayload,
  ICreateTechnicianProfile,
  IUpdateAvailableSlotPayload,
  IUpdateBookingStatusPayload,
} from "./technician.interface";
import { AppError } from "../../utils/appError";

const createTechnicianProfileInDB = async (
  userId: string,
  payload: ICreateTechnicianProfile,
) => {
  const { bio, skills, experienceYears, city } = payload;

  const createdProfile = await prisma.technicianProfile.create({
    data: {
      userId,
      bio,
      skills,
      experienceYears,
      city,
    },
  });

  const result = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  return result;
};

const getAllServicesFromDB = async () => {
  const result = await prisma.service.findMany();

  return result;
};

const createAvailableSlotInDB = async (
  userId: string,
  payload: ICreateAvailableSlotPayload,
) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const result = await prisma.availabilitySlot.create({
    data: {
      technicianId: technician.id,
      ...payload,
    },
  });

  return result;
};

const getAllSlotsFromDB = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technician) {
    throw new Error("You don't have a technician profile.");
  }

  const result = await prisma.availabilitySlot.findMany({
    where: {
      technicianId: technician.id,
    },
  });

  return result;
};

const updateSlotInDB = async (
  userId: string,
  payload: IUpdateAvailableSlotPayload,
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  const result = await prisma.availabilitySlot.update({
    where: {
      id: payload.id,
    },
    data: {
      ...payload,
    },
  });

  return result;
};

const getMyAllBookingsFromDB = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technician) {
    throw new Error("You don't have a profile");
  }

  const result = await prisma.booking.findMany({
    where: {
      technicianId: technician.id,
    },
  });

  return result;
};

const getMyBookingByIdFromDB = async (userId: string, bookingId: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technician) {
    throw new Error("You don't have a profile");
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking does not exist");
  }

  return booking;
};

const updateBookingStatusInDB = async (
  userId: string,
  bookingId: string,
  payload: IUpdateBookingStatusPayload,
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technician) {
    throw new AppError(404, "You don't have a profile", "");
  }

  const bookingExits = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      technicianId: technician.id,
    },
  });

  if (!bookingExits) {
    throw new AppError(404, "Booking does not exist", "");
  }

  switch (bookingExits.status) {
    case "PENDING": {
      if (payload.status !== "ACCEPTED" && payload.status !== "DECLINED") {
        throw new AppError(
          400,
          `Cannot change status from PENDING to ${payload.status}`,
          "",
        );
      }
      break;
    }

    case "IN_PROGRESS": {
      if (payload.status !== "COMPLETED" && payload.status !== "CANCELLED") {
        throw new AppError(
          400,
          `Cannot change status from 'IN_PROGRESS' to ${payload.status}`,
          "",
        );
      }

      break;
    }

    default: {
      throw new AppError(
        400,
        `Cannot change status from ${bookingExits.status}`,
        "",
      );
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.update({
      where: {
        id: bookingId,
      },

      data: {
        ...payload,
      },
    });

    if (
      payload.status === "COMPLETED" ||
      payload.status === "DECLINED" ||
      payload.status === "CANCELLED"
    ) {
      await tx.availabilitySlot.update({
        where: {
          id: booking.slotId,
        },
        data: {
          isBooked: false,
        },
      });
    }

    return booking;
  });

  return result;
};

const getAllReviewsOnMeFromDB = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technician) {
    throw new Error("You don't have a technician profile");
  }

  const result = await prisma.review.findMany({
    where: {
      technicianId: technician.id,
    },
  });

  return result;
};

const deleteOwnProfileInDB = async (userId: string) => {
  await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const result = await prisma.technicianProfile.delete({
    where: {
      userId,
    },
  });

  return result;
};

export const technicianService = {
  createTechnicianProfileInDB,
  getAllServicesFromDB,
  createAvailableSlotInDB,
  getAllSlotsFromDB,
  updateSlotInDB,
  getMyAllBookingsFromDB,
  getMyBookingByIdFromDB,
  updateBookingStatusInDB,
  getAllReviewsOnMeFromDB,
  deleteOwnProfileInDB,
};
