import { prisma } from "../../lib/prisma";

const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany({
    where: {
      isActive: true,
    },

    include: {
      services: true,
    },
  });

  return result;
};

export const categoryService = {
    getAllCategoriesFromDB
}
