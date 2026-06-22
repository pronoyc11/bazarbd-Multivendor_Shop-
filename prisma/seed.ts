import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding শুরু হচ্ছে...");

  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  // Password hash করা
  const adminPassword = await bcrypt.hash("admin123", 10);
  const vendorPassword = await bcrypt.hash("vendor123", 10);
  const buyerPassword = await bcrypt.hash("buyer123", 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@bazarbd.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin তৈরি:", admin.email);

  // Vendor Users
  const vendorUser1 = await prisma.user.create({
    data: {
      name: "Rahim Uddin",
      email: "rahim@dhaka-electronics.com",
      password: vendorPassword,
      role: "VENDOR",
    },
  });

  const vendorUser2 = await prisma.user.create({
    data: {
      name: "Karim Mia",
      email: "karim@techstore.com",
      password: vendorPassword,
      role: "VENDOR",
    },
  });
  console.log("✅ Vendor Users তৈরি");

  // Buyer User
  await prisma.user.create({
    data: {
      name: "Test Buyer",
      email: "buyer@test.com",
      password: buyerPassword,
      role: "BUYER",
    },
  });
  console.log("✅ Buyer User তৈরি");

  // Vendor Shops
  const vendor1 = await prisma.vendor.create({
    data: {
      shopName: "Dhaka Electronics",
      description: "সেরা Electronics পণ্য",
      isApproved: true,
      userId: vendorUser1.id,
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      shopName: "Tech Store BD",
      description: "Latest Technology Products",
      isApproved: true,
      userId: vendorUser2.id,
    },
  });
  console.log("✅ Vendor Shops তৈরি");

  // Products
  await prisma.product.createMany({
    data: [
      {
        name: "Nokia 1100 Phone",
        description: "বাংলাদেশের সবচেয়ে জনপ্রিয় ফোন",
        price: 8500,
        emoji: "📱",
        category: "Electronics",
        stock: 15,
        featured: true,
        vendorId: vendor1.id,
      },
      {
        name: "HP Pavilion Laptop",
        description: "Student ও Professional-দের জন্য",
        price: 55000,
        emoji: "💻",
        category: "Electronics",
        stock: 8,
        featured: true,
        vendorId: vendor2.id,
      },
      {
        name: "Samsung Smart TV",
        description: "৪K Ultra HD Smart Television",
        price: 35000,
        emoji: "📺",
        category: "Electronics",
        stock: 5,
        featured: true,
        vendorId: vendor1.id,
      },
      {
        name: "Wireless Headphone",
        description: "Noise Cancelling Bluetooth Headphone",
        price: 1200,
        emoji: "🎧",
        category: "Electronics",
        stock: 25,
        featured: false,
        vendorId: vendor2.id,
      },
      {
        name: "Smart Watch",
        description: "Health Tracking Smart Watch",
        price: 3500,
        emoji: "⌚",
        category: "Electronics",
        stock: 12,
        featured: false,
        vendorId: vendor1.id,
      },
      {
        name: "Cotton Panjabi",
        description: "উচ্চমানের কটন পাঞ্জাবি",
        price: 850,
        emoji: "👘",
        category: "Fashion",
        stock: 50,
        featured: false,
        vendorId: vendor2.id,
      },
      {
        name: "Leather Wallet",
        description: "খাঁটি চামড়ার মানিব্যাগ",
        price: 650,
        emoji: "👜",
        category: "Fashion",
        stock: 40,
        featured: false,
        vendorId: vendor1.id,
      },
      {
        name: "Cricket Bat",
        description: "Professional Grade Cricket Bat",
        price: 1800,
        emoji: "🏏",
        category: "Sports",
        stock: 20,
        featured: false,
        vendorId: vendor2.id,
      },
    ],
  });
  console.log("✅ Products তৈরি");

  console.log("\n🎉 Seeding সম্পূর্ণ!");
  console.log("📧 Test Accounts:");
  console.log("   Admin:  admin@bazarbd.com  / admin123");
  console.log("   Vendor: rahim@dhaka-electronics.com / vendor123");
  console.log("   Buyer:  buyer@test.com / buyer123");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });