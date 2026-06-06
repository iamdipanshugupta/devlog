import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding process shuru ho raha hai...");

  const user = await prisma.user.upsert({
    where: {
      email: "test@devlog.com",
    },
    update: {},
    create: {
      email: "test@devlog.com",
      name: "Test User",
    },
  });

  console.log("User created:", user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });