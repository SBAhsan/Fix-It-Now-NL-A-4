import { prisma } from "../../lib/prisma";
import { ICreateBookingPayload } from "./bookings.interface";

const createBookingInDB = async (
  customerId: string,
  payload: ICreateBookingPayload,
) => {
  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: payload.serviceId,
    },
  });

  const result = await prisma.$transaction(async (tx) => {

    const slot = await tx.availabilitySlot.findUnique({
        where: {
            id: payload.slotId
        }
    })

    if(!slot) {
        throw new Error ("This slot does not exist");
    }

    if(!slot.isBooked){
        throw new Error ("This slot is already booked");
    }


    await tx.availabilitySlot.update({
        where: {
            id: payload.slotId
        },
        data: {
            isBooked: true
        }
    })

    await tx.booking.findUniqueOrThrow({
      where: {
        slotId: payload.slotId,
      },
    });

    const booking = await tx.booking.create({
      data: {
        customerId,
        technicianId: payload.technicianId,
        serviceId: payload.serviceId,
        slotId: payload.slotId,
        scheduledDate: payload.scheduledDate,
        scheduledTime: payload.scheduledTime,
        workAddress: payload.workAddress,
        totalAmount: service.price,
      },
    });

    return booking;
  });

  return result;
};

export const bookingService = {
  createBookingInDB,
};
