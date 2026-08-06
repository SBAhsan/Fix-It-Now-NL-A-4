import { prisma } from "../../lib/prisma";

const getAllProfileFromDB = async () => {
  const profiles = await prisma.technicianProfile.findMany({
    include: {
        availabilitySlots : true
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