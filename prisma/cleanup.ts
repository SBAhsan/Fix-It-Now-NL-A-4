import { prisma } from "../src/lib/prisma";

prisma.user
  .deleteMany({
    where: {
      email: {
        in: [
          "admin@example.com",
          "rakib@example.com",
          "nusrat@example.com",
          "karim@example.com",
          "shahin@example.com",
        ],
      },
    },
  })
  .then((result) => {
    console.log("deleted users:", result.count);
    process.exit(0);
  });