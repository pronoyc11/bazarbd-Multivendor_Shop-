import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET — এই vendor-এর সব products
export async function GET() {
  try {
    const session = await auth();

    // Login চেক
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Login করুন" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id as string;

    // এই user-এর Vendor shop খোঁজো
    const vendor = await prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor account নেই" },
        { status: 404 }
      );
    }

    // এই vendor-এর products আনো
    const products = await prisma.product.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      total: products.length,
      data: products,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "কিছু ভুল হয়েছে" },
      { status: 500 }
    );
  }
}

// POST — নতুন product তৈরি
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Login করুন" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id as string;

    // Vendor খোঁজো
    const vendor = await prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor account নেই" },
        { status: 404 }
      );
    }

    // Request body পড়ো
    const body = await request.json();
    const { name, description, price, category, stock, emoji } = body;

    // Validation
    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: "নাম, দাম ও category দিতে হবে" },
        { status: 400 }
      );
    }

    // নতুন product তৈরি
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseInt(price),
        category,
        stock: parseInt(stock) || 0,
        emoji: emoji || "📦",
        vendorId: vendor.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product তৈরি হয়েছে!",
      data: product,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "কিছু ভুল হয়েছে" },
      { status: 500 }
    );
  }
}