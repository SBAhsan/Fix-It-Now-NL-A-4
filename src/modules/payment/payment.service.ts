import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError } from "../../utils/appError";

const createCheckoutSessionInDB = async (
  customerId: string,
  bookingId: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },

    include: {
      technician: true,
      payment: true,
    },
  });

  console.log(bookingId);

  if (!booking) {
    throw new AppError(404, "This booking does not exist", "");
  }

  if(booking.payment){
    throw new AppError (400, "Payment already done", "");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(403, "This booking is not yours", "");
  }

  if (booking.status === "COMPLETED") {
    throw new AppError(404, "Payment already completed", "");
  }

  if (booking.status !== "PENDING" && booking.status !== "ACCEPTED") {
    throw new AppError(400, `Cannot pay for ${booking.status} booking`, "");
  }

  let session;
  try {
    session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    metadata: { bookingId: booking.id },
    success_url: "http://localhost:5000/payment/success",
    cancel_url: "http://localhost:5000/payment/cancel",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: `Booking #${booking.id}`,
          },
          unit_amount: Math.round(Number(booking.totalAmount) * 100),
        },
      },
    ],
  });

  console.log('Session Created: ',session.id);
  } catch (error) {
    console.log('Stripe Error: ', error);
    throw error
  }

  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: booking.totalAmount,
      status: "PENDING",
      provider: "Stripe",
      transactionId: session.id,
    },
  });

  console.log(payment);

  return { url: session.url, payment };
};

const handleWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) break;

      await prisma.payment.update({
        where: {
          bookingId,
        },
        data: {
          status: "COMPLETED",
        },
      });

      await prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status: "IN_PROGRESS",
        },
      });

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) break;

      await prisma.payment.update({
        where: {
          bookingId,
        },
        data: {
          status: "FAILED",
        },
      });

      break;
    }

    default:
      break;
  }
};

const getPaymentHistoryFromDB = async (customerId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        customerId,
      },
    },
    include: {
      booking: {
        select: {
          id: true,
          scheduledDate: true,
          workAddress: true,
          status: true,
        },
      },
    },
    orderBy: {
      paidAt: "desc",
    },
  });

  return payments;
};

const getPaymentHistoryByIdFromDB = async (
  customerId: string,
  paymentId: string,
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      booking: true,
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found", "");
  }

  if (payment.booking.customerId !== customerId) {
    throw new AppError(403, "You are not authorized to view this payment", "");
  }

  return payment;
};

export const paymentService = {
  createCheckoutSessionInDB,
  handleWebhookEvent,
  getPaymentHistoryFromDB,
  getPaymentHistoryByIdFromDB,
};
