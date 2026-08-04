import { prisma } from "../../lib/prisma";
import { ICreateBookingPayload } from "./bookings.interface";

const createBookingInDB = async(customerId: string, payload: ICreateBookingPayload) => {

    const service = await prisma.service.findUniqueOrThrow({
        where: {
            id: payload.serviceId
        }
    })

    await prisma.booking.findUniqueOrThrow({
        where: {
            slotId: payload.slotId
        }
    });

    await prisma.booking.create({
        data: {
            customerId,
            technicianId: payload.technicianId,
            serviceId: payload.serviceId,
            slotId: payload.slotId,
            scheduledDate: payload.scheduledDate,
            scheduledTime: payload.scheduledTime,
            workAddress: payload.workAddress,
            totalAmount: service.price
        }
    });

    const result = await prisma.booking.findUnique({
        where: {
            slotId: payload.slotId
        }
    });

    return result;
};


export const bookingService = {
    createBookingInDB
}