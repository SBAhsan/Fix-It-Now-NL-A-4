import { error } from "node:console";
import { prisma } from "../../lib/prisma";
import {
    ICreateAvailableSlotPayload,
  ICreateServicePayload,
  ICreateTechnicianProfile,
  IUpdateAvailableSlotPayload,
  IUpdateBookingStatusPayload,
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

    const result = await prisma.availabilitySlot.create({
        data: {
            technicianId: technician.id,
            ...payload
        }
    });
    
    return result;
};

const getAllSlotsFromDB = async (userId: string) => {
    const technician = await prisma.technicianProfile.findUnique({
        where: {
            userId
        }
    });

    if(!technician) {
        throw new Error ("You don't have a technician profile.")
    }

    const result = await prisma.availabilitySlot.findMany({
        where: {
            technicianId: technician.id
        }
    });

    return result;
};

const updateSlotInDB = async (userId: string, payload: IUpdateAvailableSlotPayload) => {
    const technician = await prisma.technicianProfile.findUnique({
        where: {
            userId
        }
    });

    const result = await prisma.availabilitySlot.update({
        where: {
            id: payload.id
        },
        data: {
            ...payload
        }
    })

    return result;
}

const getMyAllBookingsFromDB = async (userId: string) => {
    const technician = await prisma.technicianProfile.findUnique({
        where: {
            userId
        }
    });

    if(!technician) {
        throw new Error ("You don't have a profile")
    }

    const result = await prisma.booking.findMany({
        where: {
            technicianId: technician.id
        }
    });

    return result;
};

const getMyBookingByIdFromDB = async (userId: string, bookingId: string) => {

    const technician = await prisma.technicianProfile.findUnique({
        where: {
            userId
        }
    });

    if(!technician) {
        throw new Error ("You don't have a profile")
    }

    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId
        }
    })

    if(!booking) {
        throw new Error ("Booking does not exist")
    }

    return booking;
}

const updateBookingStatusInDB = async (userId: string, bookingId: string, payload: IUpdateBookingStatusPayload) => {
    const technician = await prisma.technicianProfile.findUnique({
        where: {
            userId
        }
    });

    if(!technician) {
        throw new Error ("You don't have a profile")
    }

    const bookingExits = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            technicianId: technician.id,
        }
    })

    if(!bookingExits) {
        throw new Error ("Booking does not exists")
    }

    const result = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.update({
            where: {
                id: bookingId
            },

            data: {
                ...payload
            }
        })

        if(payload.status === 'COMPLETED' || payload.status === 'DECLINED' || payload.status === 'CANCELLED'){
            await tx.availabilitySlot.update({
                where: {
                    id: booking.slotId
                },
                data: {
                    isBooked: false
                }
            });
        };

        return booking;
    });

    return result;
};

const getAllReviewsOnMeFromDB = async (userId: string) => {
    const technician = await prisma.technicianProfile.findUnique({
        where: {
            userId
        }
    })

    if(!technician) {
        throw new Error ("You don't have a technician profile")
    }

    const result = await prisma.review.findMany({
        where: {
            technicianId: technician.id
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
  getAllSlotsFromDB,
  updateSlotInDB,
  getMyAllBookingsFromDB,
  getMyBookingByIdFromDB,
  updateBookingStatusInDB,
  getAllReviewsOnMeFromDB,
  deleteOwnProfileInDB,
};
