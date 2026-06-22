import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");

    const products = await prisma.product.findMany({
      where: {
        ...(featured === "true" && { featured: true }),
        ...(category && { category }),
      },
      include: {
        vendor: {
          select: {
            shopName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to load products." },
      { status: 500 },
    );
  }
}
