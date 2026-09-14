import { prisma } from "../../lib/prisma";
import { ICreateCategoryPayload, IUpdateUser } from "./admin.interface";

const createCategoryInDB = async (payload: ICreateCategoryPayload) => {
  const { name, description, isActive } = payload;

  const doCategoryExist = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (doCategoryExist) {
    throw new Error("Category already exists");
  }

  await prisma.category.create({
    data: {
      name,
      description,
      isActive,
    },
  });

  const result = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  return result;
};

const getAllCategoriesInDB = async () => {
  const result = await prisma.category.findMany();

  return result;
};

const getAllServicesFromDB = async () => {
  const result = await prisma.service.findMany();

  return result;
};

const getAllBookingsFromDB = async () => {
  return prisma.booking.findMany({
    include: {
      customer: { select: { name: true } },
      technician: {
        include: { user: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getAllUserFromDB = async () => {
  const result = await prisma.user.findMany({
    omit: {
      password: true,
    },
  });

  return result;
};

const updateCategoryInDB = async (name: string, payload: { isActive: boolean }) => {
  const category = await prisma.category.findUnique({
    where: { name },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  await prisma.category.update({
    where: { name },
    data: { isActive: payload.isActive },
  });

  const result = await prisma.category.findUnique({
    where: { name },
  });

  return result;
};

const updateUserFromDB = async (userId: string, payload: IUpdateUser) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: payload.status,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

const getTechnicianProfileFromDB = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, status: true, createdAt: true } },
      services: true,
    },
  });

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  return technician;
};

const deleteTechnicianProfileInDB = async (profileId: string) => {

    const profile = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            id: profileId
        }
    })
    const result = await prisma.technicianProfile.delete({
        where: {
            id: profileId
        }
    });

    return result;
}

export const adminService = {
  createCategoryInDB,
  getAllCategoriesInDB,
  getAllServicesFromDB,
  getAllBookingsFromDB,
  getAllUserFromDB,
  updateCategoryInDB,
  updateUserFromDB,
  getTechnicianProfileFromDB,
  deleteTechnicianProfileInDB
};
