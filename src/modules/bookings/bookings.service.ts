import { prisma } from "../../lib/prisma";
import { ICreateBookingPayload } from "./bookings.interface";

const createBookingInDB = async (
  customerId: string,
  payload: ICreateBookingPayload,
) => {

  const result = await prisma.$transaction(async (tx) => {
    const services = await tx.service.findMany({
    where: {
      id: {
        in: payload.serviceIds,
      },
      technicianId: payload.technicianId
    },
  });

  if(services.length !== payload.serviceIds.length) {
    throw new Error ("One or more services do not exist for this technician")
  }

  const totalAmount = services.reduce((sum, s) => sum + Number(s.price), 0);

    const slot = await tx.availabilitySlot.findUnique({
        where: {
            id: payload.slotId
        }
    })

    if(!slot) {
        throw new Error ("This slot does not exist");
    }

    if(slot.isBooked){
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

    const bookingExists =  await tx.booking.findUnique({
      where: {
        slotId: payload.slotId,
      },
    });

    if(bookingExists) {
        throw new Error ("You have already booked the slot.");
    }

    const booking = await tx.booking.create({
      data: {
        customerId,
        technicianId: payload.technicianId,
        slotId: payload.slotId,
        scheduledDate: payload.scheduledDate,
        scheduledTime: payload.scheduledTime,
        workAddress: payload.workAddress,
        totalAmount
      },
    });

    await tx.bookingItem.createMany({
        data: services.map((service) => ({
            bookingId: booking.id,
            serviceId: service.id,
            priceAtBooking: service.price
        }))
    })

    return booking;
  });

  return result;
};

export const bookingService = {
  createBookingInDB,
};
