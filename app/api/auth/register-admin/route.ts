import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signAdminToken, COOKIE_NAME } from "@/lib/auth";
import { createAdminSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = createAdminSchema.parse(body);

    const normalizedEmail = email.toLowerCase().trim();

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "An administrator account with this email already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = await prisma.admin.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    const token = await signAdminToken({
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin profile created successfully",
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });

    // Auto-login the newly created admin
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0]?.message || "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Register admin error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while creating admin profile",
      },
      { status: 500 }
    );
  }
}

