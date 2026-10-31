import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const campId = parseInt(id, 10);
    if (isNaN(campId)) {
      return NextResponse.json({ success: false, error: "Invalid camp ID" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: any = {};

    if (body.status !== undefined) updateData.status = body.status;
    if (body.collectedBags !== undefined) updateData.collectedBags = Number(body.collectedBags);
    if (body.targetBags !== undefined) updateData.targetBags = Number(body.targetBags);
    if (body.campTitle !== undefined) updateData.campTitle = body.campTitle;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.campDate !== undefined) updateData.campDate = new Date(body.campDate);

    const updated = await prisma.campSchedule.update({
      where: { id: campId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Camp schedule updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating camp:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update camp schedule", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const campId = parseInt(id, 10);
    if (isNaN(campId)) {
      return NextResponse.json({ success: false, error: "Invalid camp ID" }, { status: 400 });
    }

    await prisma.campSchedule.delete({
      where: { id: campId },
    });

    return NextResponse.json({
      success: true,
      message: "Camp schedule deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting camp:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete camp schedule", details: error.message },
      { status: 500 }
    );
  }
}

