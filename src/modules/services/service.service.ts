import { title } from "node:process";
import { prisma } from "../../lib/prisma";
import { ICreateServicePayload, IServiceQuery } from "./service.interface";

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

  return service;
};

const getAllServicesFromDB = async (query: IServiceQuery) => {
  const andConditions: IServiceQuery[] = [];

  if (query.searchItem) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchItem,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchItem,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: query.searchItem,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  if (query.location) {
    andConditions.push({
      technician: {
        city: {
          contains: query.location,
          mode: "insensitive",
        },
      },
    });
  }

  const services = await prisma.service.findMany({
    where: {
      isActive: true,
      AND: andConditions
    },
    include: {
      category: true,
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const technicianIds = [...new Set(services.map((s) => s.technicianId))];

  const ratings = await prisma.review.groupBy({
    by: ["technicianId"],
    where: {
      technicianId: {
        in: technicianIds,
      },
    },
    _avg: {
      rating: true,
    },
  });

  const ratingsMap = new Map(ratings.map((r) => [r.technicianId, r._avg ?? 0]));

  let result = services.map((service) => ({
    ...service,
    technicianRating: ratingsMap.get(service.technicianId) ?? 0,
  }));

  if (query.rating) {
    result = result.filter(
      (service) => service.technicianRating === query.rating,
    );
  }

  return result;
};

export const serviceService = {
  createServiceInDB,
  getAllServicesFromDB,
};
