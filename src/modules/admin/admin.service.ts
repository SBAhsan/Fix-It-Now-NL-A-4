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

const getAllUserFromDB = async () => {
  const result = await prisma.user.findMany({
    omit: {
      password: true,
    },
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

export const adminService = {
  createCategoryInDB,
  getAllCategoriesInDB,
  getAllUserFromDB,
  updateUserFromDB,
};
