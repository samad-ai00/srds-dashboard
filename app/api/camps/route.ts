import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { campScheduleSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const city = searchParams.get("city");

    const where: any = {};
    if (status && status !== "all") where.status = status;
    if (city && city !== "all") where.targetCity = { contains: city };

    const camps = await prisma.campSchedule.findMany({
      where,
      orderBy: { campDate: "asc" },
    });

    return NextResponse.json({
      success: true,
      count: camps.length,
      data: camps,
    });
  } catch (error: any) {
    console.error("Error fetching camps:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch camp schedules", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = campScheduleSchema.parse(body);

    const camp = await prisma.campSchedule.create({
      data: {
        campTitle: validatedData.campTitle,
        location: validatedData.location,
        targetCity: validatedData.targetCity,
        campDate: new Date(validatedData.campDate),
        targetBags: validatedData.targetBags,
        collectedBags: validatedData.collectedBags,
        coordinatorName: validatedData.coordinatorName,
        contactNumber: validatedData.contactNumber,
        status: validatedData.status,
      },
    });

    return NextResponse.json(
      { success: true, message: "Blood donation camp scheduled successfully", data: camp },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating camp:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create camp schedule", details: error.message },
      { status: 500 }
    );
  }
}

