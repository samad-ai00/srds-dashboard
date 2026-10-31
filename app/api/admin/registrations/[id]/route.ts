import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registrationStatusUpdateSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = registrationStatusUpdateSchema.parse(body);

    const regId = parseInt(id, 10);
    if (isNaN(regId)) {
      return NextResponse.json(
        { success: false, error: "Invalid registration ID" },
        { status: 400 }
      );
    }

    const existing = await prisma.teamRegistration.findUnique({
      where: { id: regId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.teamRegistration.update({
      where: { id: regId },
      data: {
        status: validatedData.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Application status updated to ${validatedData.status}`,
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating registration status:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update registration status",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const regId = parseInt(id, 10);
    if (isNaN(regId)) {
      return NextResponse.json(
        { success: false, error: "Invalid registration ID" },
        { status: 400 }
      );
    }

    await prisma.teamRegistration.delete({
      where: { id: regId },
    });

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete registration",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
