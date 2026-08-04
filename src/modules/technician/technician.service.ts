import { prisma } from "../../lib/prisma";
import {
    ICreateAvailableSlotPayload,
  ICreateServicePayload,
  ICreateTechnicianProfile,
} from "./technician.interface";

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

const getAllProfileFromDB = async () => {
  const profiles = await prisma.technicianProfile.findMany();

  return profiles;
};

const getSingleProfileFromDB = async (profileId: string) => {
  const profile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id: profileId,
    },
    include: {
      reviews: true,
    },
  });

  return profile;
};

const createServiceInDB = async (
  userId: string,
  payload: ICreateServicePayload,
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technician) {
    throw new Error("Technician profile not found. Create your profile first.");
  }

  const doServiceExist = await prisma.service.findFirst({
    where: {
      technicianId: technician?.id,
      title: payload.title,
      price: payload.price,
      categoryId: payload.categoryId,
    },
  });

  if (doServiceExist) {
    throw new Error("Service already exists");
  }

  const service = await prisma.service.create({
    data: {
      technicianId: technician?.id,
      ...payload,
    },
  });

  const result = await prisma.service.findFirst({
    where: {
      technicianId: technician?.id,
      title: payload.title,
      price: payload.price,
      categoryId: payload.categoryId,
    },
  });

  return result;
};

const getAllServicesFromDB = async () => {
  const result = await prisma.service.findMany();

  return result;
};

const createAvailableSlotInDB = async (userId: string, payload: ICreateAvailableSlotPayload) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            userId
        }
    });

    await prisma.availabilitySlot.create({
        data: {
            technicianId: technician.id,
            ...payload
        }
    });

    const result = await prisma.availabilitySlot.findFirst({
        where: {
            technicianId: technician.id,
            slotDate: payload.slotDate,
            slotTime: payload.slotTime
        }
    });
    
    return result;
}

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
  getAllProfileFromDB,
  getSingleProfileFromDB,
  createServiceInDB,
  getAllServicesFromDB,
  createAvailableSlotInDB,
  deleteOwnProfileInDB,
};
