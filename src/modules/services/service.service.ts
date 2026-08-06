import { prisma } from "../../lib/prisma";
import { ICreateServicePayload } from "./service.interface";


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


const getAllServicesFromDB = async() => {
    const result = await prisma.service.findMany({
        where: {
            isActive: true
        },

        include: {
            technician: true
        }
    });

    return result;
};



export const serviceService = {
    createServiceInDB,
    getAllServicesFromDB,
}