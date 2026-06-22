import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // ১. সব field দেওয়া হয়েছে কিনা চেক
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "সব তথ্য দিতে হবে" },
        { status: 400 }
      );
    }

    // ২. Password কমপক্ষে ৬ অক্ষর কিনা চেক
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password কমপক্ষে ৬ অক্ষর হতে হবে" },
        { status: 400 }
      );
    }

    // ৩. এই email আগে থেকে আছে কিনা চেক
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "এই Email দিয়ে আগেই Account আছে" },
        { status: 409 }
      );
    }

    // ৪. Password hash করো
    const hashedPassword = await bcrypt.hash(password, 10);

    // ৫. নতুন User তৈরি করো
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "BUYER", // Default role
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account তৈরি হয়েছে!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch {
    return NextResponse.json(
      { success: false, error: "কিছু ভুল হয়েছে" },
      { status: 500 }
    );
  }
}
