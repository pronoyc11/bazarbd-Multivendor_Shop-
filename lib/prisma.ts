import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Adapter বানাও — Prisma 7-এর নতুন নিয়ম
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// Singleton pattern — একটাই PrismaClient instance থাকবে
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}