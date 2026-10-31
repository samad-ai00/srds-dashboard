import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAdminFromRequest,
  comparePassword,
  hashPassword,
  signAdminToken,
  COOKIE_NAME,
} from "@/lib/auth";
import { createAdminSchema, updateAdminProfileSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentAdmin = await prisma.admin.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!currentAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin profile not found" },
        { status: 404 }
      );
    }

    const allAdmins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      profile: currentAdmin,
      admins: allAdmins,
    });
  } catch (error) {
    console.error("Fetch admin profile error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAdminFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword } =
      updateAdminProfileSchema.parse(body);

    const existingAdmin = await prisma.admin.findUnique({
      where: { id: session.id },
    });

    if (!existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin profile not found" },
        { status: 404 }
      );
    }

    const updateData: { name?: string; email?: string; password?: string } = {};

    if (name && name !== existingAdmin.name) {
      updateData.name = name.trim();
    }

    if (email && email.toLowerCase().trim() !== existingAdmin.email) {
      const normalizedEmail = email.toLowerCase().trim();
      const duplicate = await prisma.admin.findUnique({
        where: { email: normalizedEmail },
      });
      if (duplicate && duplicate.id !== existingAdmin.id) {
        return NextResponse.json(
          { success: false, error: "This email is already in use by another admin" },
          { status: 409 }
        );
      }
      updateData.email = normalizedEmail;
    }

    // Changing password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            success: false,
            error: "Current password is required to set a new password",
          },
          { status: 400 }
        );
      }

      const isValidPassword = await comparePassword(
        currentPassword,
        existingAdmin.password
      );

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: "Current password does not match" },
          { status: 400 }
        );
      }

      updateData.password = await hashPassword(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: true,
        message: "No changes detected",
        profile: {
          id: existingAdmin.id,
          name: existingAdmin.name,
          email: existingAdmin.email,
        },
      });
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Re-issue JWT cookie with updated name/email
    const token = await signAdminToken({
      id: updatedAdmin.id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin profile updated successfully",
      profile: updatedAdmin,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
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

    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error updating profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, password } = createAdminSchema.parse(body);

    const normalizedEmail = email.toLowerCase().trim();

    const existingAdmin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "An administrator with this email already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const created = await prisma.admin.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "New admin profile created successfully",
      admin: created,
    });
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

    console.error("Create admin error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error creating admin profile" },
      { status: 500 }
    );
  }
}

