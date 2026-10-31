import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { donorDispatchSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const urgency = searchParams.get("urgency");

    const where: any = {};
    if (status && status !== "all") where.status = status;
    if (urgency && urgency !== "all") where.urgency = urgency;

    const dispatches = await prisma.donorDispatch.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: dispatches.length,
      data: dispatches,
    });
  } catch (error: any) {
    console.error("Error fetching dispatches:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dispatches", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = donorDispatchSchema.parse(body);

    const dispatch = await prisma.donorDispatch.create({
      data: {
        fighterId: validatedData.fighterId,
        fighterName: validatedData.fighterName,
        donorId: validatedData.donorId || null,
        donorName: validatedData.donorName,
        donorPhone: validatedData.donorPhone,
        bloodGroup: validatedData.bloodGroup,
        hospital: validatedData.hospital,
        urgency: validatedData.urgency,
        status: validatedData.status,
        notes: validatedData.notes || null,
      },
    });

    return NextResponse.json(
      { success: true, message: "Donor dispatched successfully", data: dispatch },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating dispatch:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to dispatch donor", details: error.message },
      { status: 500 }
    );
  }
}

