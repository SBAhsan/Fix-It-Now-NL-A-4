import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { BookingStatus, UserRole } from "./generated/prisma/enums";

async function main() {
  const hashedPassword = await bcrypt.hash("Passw0rd!123", 10);

  const [customer1, customer2] = await Promise.all([
    await prisma.user.create({
      data: {
        name: "Rakib Hasan",
        email: "rakib@example.com",
        password: hashedPassword,
        phone: "01710000001",
        role: UserRole.CUSTOMER,
      },
    }),

    await prisma.user.create({
      data: {
        name: "Nusrat Jahan",
        email: "nusrat@example.com",
        password: hashedPassword,
        phone: "01710000002",
        role: UserRole.CUSTOMER,
      },
    }),
  ]);

  const [techUser1, techUser2] = await Promise.all([
    await prisma.user.create({
      data: {
        name: "Karim Mia",
        email: "karim@example.com",
        password: hashedPassword,
        phone: "01810000001",
        role: UserRole.TECHNICIAN,
      },
    }),

    await prisma.user.create({
      data: {
        name: "Shahin Alam",
        email: "shahin@example.com",
        password: hashedPassword,
        phone: "01810000002",
        role: UserRole.TECHNICIAN,
      },
    }),
  ]);

  const [technician1, technician2] = await Promise.all([
    await prisma.technicianProfile.create({
      data: {
        userId: techUser1.id,
        bio: "10 years experience in residential electrical work.",
        skills: ["wiring", "circuit repair", "installation"],
        experienceYears: 10,
        city: "Chittagong",
        avgRating: 4.5,
        totalReviews: 12,
      },
    }),

    await prisma.technicianProfile.create({
      data: {
        userId: techUser2.id,
        bio: "Licensed plumber specializing in leak repair.",
        skills: ["pipe fitting", "leak repair", "installation"],
        experienceYears: 6,
        city: "Dhaka",
        avgRating: 4.0,
        totalReviews: 8,
      },
    }),
  ]);

  const [category1, category2, category3] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electrical",
        isActive: true,
      },
    }),

    prisma.category.create({
      data: {
        name: "Plumbing",
        isActive: true,
      },
    }),

    prisma.category.create({
      data: {
        name: "Cleaning",
        isActive: true,
      },
    }),
  ]);

  const [service1, service2] = await Promise.all([
    await prisma.service.create({
      data: {
        title: "Home Wiring Inspection",
        description: "Full inspection of home electrical wiring.",
        price: 1500,
        isActive: true,
        technicianId: technician1.id,
        categoryId: category1.id,
      },
    }),

    await prisma.service.create({
      data: {
        title: "Leak Detection & Repair",
        description: "Detect and fix pipe leaks.",
        price: 1200,
        isActive: true,
        technicianId: technician2.id,
        categoryId: category2.id,
      },
    }),
  ]);

  const [slot1, slot2] = await Promise.all([
    await prisma.availabilitySlot.create({
      data: {
        technicianId: technician1.id,
        slotDate: new Date("2026-08-10"),
        slotTime: new Date("2026-08-10T10:00:00"),
        isBooked: true,
      },
    }),

    await prisma.availabilitySlot.create({
      data: {
        technicianId: technician2.id,
        slotDate: new Date("2026-08-12"),
        slotTime: new Date("2026-08-12T14:00:00"),
        isBooked: true,
      },
    }),
  ]);

  const [booking1, booking2] = await Promise.all([
    await prisma.booking.create({
      data: {
        customerId: customer1.id,
        technicianId: technician1.id,
        slotId: slot1.id,
        scheduledDate: new Date("2026-08-10"),
        scheduledTime: new Date("2026-08-10T10:00:00"),
        workAddress: "House 12, Road 4, Chittagong",
        totalAmount: 1500,
        status: BookingStatus.COMPLETED,
      },
    }),

    await prisma.booking.create({
      data: {
        customerId: customer2.id,
        technicianId: technician2.id,
        slotId: slot2.id,
        scheduledDate: new Date("2026-08-12"),
        scheduledTime: new Date("2026-08-12T14:00:00"),
        workAddress: "House 7, Road 9, Dhaka",
        totalAmount: 1200,
        status: BookingStatus.PENDING,
      },
    }),
  ]);

  const review1 = await prisma.review.create({
    data: {
      bookingId: booking1.id,
      customerId: customer1.id,
      technicianId: technician1.id,
      rating: 5,
      comment: "Excellent work, very professional and on time!",
    },
  });
}

main().then(process.exit(0));
