import { prisma } from "../../lib/prisma";
import { IQueryTechnician } from "./user.interface";

const getAllProfileFromDB = async (query: IQueryTechnician) => {

    const andConditions : IQueryTechnician[] = [];

    if(query.searchItem){
        andConditions.push({
            OR: [
                {
                    bio: {
                        contains: query.searchItem,
                        mode: 'insensitive'
                    }
                },
                {
                    skills: {
                        has: query.searchItem
                    }
                },
                {
                    user: {
                        name: {
                            contains: query.searchItem,
                            mode: 'insensitive'
                        }
                    }
                }
            ]
        })
    };

    if(query.city){
        andConditions.push({
            city: {
                equals: query.city as string,
                mode: 'insensitive'
            }
        })
    };

    if(query.skill){
        andConditions.push({
            skills: {
                has: query.skill
            }
        })
    };

    if(query.minRating){
        andConditions.push({
            avgRating: {
                gte: query.minRating
            }
        })
    }

  const profiles = await prisma.technicianProfile.findMany({
    where: {
        AND: andConditions
    },
    include: {
        availabilitySlots : {
            select: {
                isBooked: true
            }
        },
        user: {
            select: {
                id: true,
                name: true,
                email: true,
                phone: true
            }
        },
        services: {
            select: {
                category: true
            }
        },
    },
    orderBy: {
        avgRating: 'desc'
    }
  });

  return profiles;
};

const getSingleProfileFromDB = async (profileId: string) => {
  const profile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id: profileId,
    },
    include: {
      reviews: true,
      availabilitySlots : true
    },
  });

  return profile;
};

export const userService = {
    getAllProfileFromDB,
    getSingleProfileFromDB,
}