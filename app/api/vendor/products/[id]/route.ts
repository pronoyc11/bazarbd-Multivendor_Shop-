import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PUT — product আপডেট করো
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Login করুন" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userId = (session.user as any).id as string;

    // এই user-এর vendor account খোঁজো
    const vendor = await prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor account নেই" },
        { status: 404 }
      );
    }

    // Product আছে কিনা এবং এই vendor-এর কিনা check
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    // অন্য vendor-এর product edit করা যাবে না
    if (existingProduct.vendorId !== vendor.id) {
      return NextResponse.json(
        { success: false, error: "এই product edit করার অনুমতি নেই" },
        { status: 403 }
      );
    }

    // Request body পড়ো
    const body = await request.json();
    const { name, description, price, category, stock, emoji } = body;

    // Product আপডেট করো
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price: parseInt(price),
        category,
        stock: parseInt(stock),
        emoji: emoji || "📦",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product আপডেট হয়েছে!",
      data: updatedProduct,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "কিছু ভুল হয়েছে" },
      { status: 500 }
    );
  }
}

// DELETE — product মুছো
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Login করুন" },
        { status: 401 }
      );
    }

    const { id } = await params;
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

    // Product খোঁজো
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    // অন্য vendor-এর product মুছা যাবে না
    if (existingProduct.vendorId !== vendor.id) {
      return NextResponse.json(
        { success: false, error: "এই product মুছার অনুমতি নেই" },
        { status: 403 }
      );
    }

    // Product মুছো
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product মুছা হয়েছে!",
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "কিছু ভুল হয়েছে" },
      { status: 500 }
    );
  }
}