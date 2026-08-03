import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const port = config.port || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log("Error connecting database", error);
    await prisma.$disconnect()
    process.exit(1);
  }
}

main();
