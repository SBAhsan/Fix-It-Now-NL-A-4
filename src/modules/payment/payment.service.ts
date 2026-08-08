import Stripe from "stripe";
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe";
import { AppError } from "../../utils/appError";

const createCheckoutSessionInDB = async (customerId: string, bookingId: string) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId
        },

        include: {
            technician: true,
            payment: true
        }
    })

    if(!booking) {
        throw new AppError (404, "This booking does not exist", '')
    }

    if(booking.customerId !== customerId){
        throw new AppError (403, "This booking is not yours", '')
    }

    if(booking.status === 'COMPLETED'){
        throw new AppError (404, "Payment already completed", '')
    }

    if(booking.status !== 'PENDING' && booking.status !== 'ACCEPTED') {
        throw new AppError (400, `Cannot pay for ${booking.status} booking`, '')
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        metadata: {bookingId: booking.id},
        success_url: "http:localhost:5000/payment/success",
        cancel_url: "http:localhost:5000/payment/cancel",
        line_items: [{
            quantity: 1,
            price_data: ({
                currency: 'USD',
                product_data: {
                    name: `Booking #${booking.id}`
                },
                unit_amount: Math.round(Number(booking.totalAmount) * 100)
            })
        }]
    });

    const payment = await prisma.payment.create({
        data: {
            bookingId: booking.id,
            amount: booking.totalAmount,
            status: 'PENDING',
            provider: 'Stripe',
            transactionId: session.id
        }
    })

    return {url: session.url, payment};
};


const handleWebhookEvent = async (event: Stripe.Event) => {
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session
            const bookingId = session.metadata?.bookingId

            if(!bookingId) break;

            await prisma.payment.update({
                where: {
                    bookingId
                },
                data: {
                    status: 'COMPLETED'
                }
            });

            await prisma.booking.update({
                where: {
                    id: bookingId
                },
                data: {
                    status: 'IN_PROGRESS'
                }
            });

            break;
        }

        case "checkout.session.expired": {
            const session = event.data.object as Stripe.Checkout.Session
            const bookingId = session.metadata?.bookingId

            if(!bookingId) break;

            await prisma.payment.update({
                where: {
                    bookingId
                },
                data: {
                    status: 'FAILED'
                }
            })

            break;
        }

        default:
            break;
            
    }
}

export const paymentService = {
    createCheckoutSessionInDB,
    handleWebhookEvent
}