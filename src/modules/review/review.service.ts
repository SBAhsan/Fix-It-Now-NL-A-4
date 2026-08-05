import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const createCustomerReviewInDB = async (customerId: string, payload: ICreateReviewPayload) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: payload.bookingId,
        }
    })

    if(!booking){
        throw new Error ("Booking not found")
    }

    if(booking.status !== 'COMPLETED') {
        throw new Error("You can only review a completed job")
    }

    const reviewExists = await prisma.review.findUnique({
        where: {
            bookingId: booking.id
        }
    })

    if(reviewExists) {
        throw new Error ("You already reviewed this booking");
    }

    const review = await prisma.review.create({
        data: {
            customerId,
            technicianId: booking.technicianId,
            ...payload
        }
    })

    return review;
};


export const reviewService = {
    createCustomerReviewInDB
}