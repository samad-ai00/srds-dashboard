import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const dispatchId = parseInt(id, 10);
    if (isNaN(dispatchId)) {
      return NextResponse.json({ success: false, error: "Invalid dispatch ID" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: any = {};

    if (body.status !== undefined) updateData.status = body.status;
    if (body.urgency !== undefined) updateData.urgency = body.urgency;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const updated = await prisma.donorDispatch.update({
      where: { id: dispatchId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Dispatch status updated",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating dispatch:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update dispatch", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const dispatchId = parseInt(id, 10);
    if (isNaN(dispatchId)) {
      return NextResponse.json({ success: false, error: "Invalid dispatch ID" }, { status: 400 });
    }

    await prisma.donorDispatch.delete({
      where: { id: dispatchId },
    });

    return NextResponse.json({
      success: true,
      message: "Dispatch deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting dispatch:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete dispatch", details: error.message },
      { status: 500 }
    );
  }
}

