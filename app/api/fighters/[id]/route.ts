import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fighterUpdateSchema } from "@/lib/validations";

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
    const validatedData = fighterUpdateSchema.parse(body);

    const isNumeric = /^\d+$/.test(id);

    // Find the record first
    const existingFighter = await prisma.fighter.findFirst({
      where: isNumeric
        ? {
            OR: [{ id: parseInt(id, 10) }, { fighterId: id }],
          }
        : { fighterId: id },
    });

    if (!existingFighter) {
      return NextResponse.json(
        {
          success: false,
          error: `Fighter with identifier "${id}" not found`,
        },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (validatedData.transfusionStatus !== undefined) {
      updateData.transfusionStatus = validatedData.transfusionStatus;
    }

    if (validatedData.lastTransfusion !== undefined) {
      updateData.lastTransfusion = validatedData.lastTransfusion
        ? new Date(validatedData.lastTransfusion)
        : null;
    }

    if (validatedData.nextDue !== undefined) {
      updateData.nextDue = validatedData.nextDue
        ? new Date(validatedData.nextDue)
        : null;
    }

    if (validatedData.hospital !== undefined) {
      updateData.hospital = validatedData.hospital;
    }

    if (validatedData.assignedNgo !== undefined) {
      updateData.assignedNgo = validatedData.assignedNgo;
    }

    if (validatedData.bloodGroup !== undefined) {
      updateData.bloodGroup = validatedData.bloodGroup;
    }

    if (validatedData.fullName !== undefined) {
      updateData.fullName = validatedData.fullName;
    }

    const updatedFighter = await prisma.fighter.update({
      where: { id: existingFighter.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Fighter record updated successfully",
      data: updatedFighter,
    });
  } catch (error: any) {
    console.error("Error updating fighter:", error);
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
        error: "Failed to update fighter record",
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
    const isNumeric = /^\d+$/.test(id);

    const existingFighter = await prisma.fighter.findFirst({
      where: isNumeric
        ? {
            OR: [{ id: parseInt(id, 10) }, { fighterId: id }],
          }
        : { fighterId: id },
    });

    if (!existingFighter) {
      return NextResponse.json(
        {
          success: false,
          error: `Fighter with identifier "${id}" not found`,
        },
        { status: 404 }
      );
    }

    await prisma.fighter.delete({
      where: { id: existingFighter.id },
    });

    return NextResponse.json({
      success: true,
      message: "Fighter record deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting fighter:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete fighter record",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
