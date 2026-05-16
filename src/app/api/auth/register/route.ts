import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { setSessionToken } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MEMBER"]).optional().default("MEMBER"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Register payload received:", body);
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      console.error("Validation errors:", result.error.format());
      const firstError = result.error.issues[0]?.message || "Invalid input";
      return NextResponse.json(
        { error: firstError, details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password, role } = result.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Set JWT Session
    await setSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      { message: "Registration successful", user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
