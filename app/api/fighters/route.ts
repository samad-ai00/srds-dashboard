import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fighterSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get("bloodGroup");
    const hospital = searchParams.get("hospital");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (bloodGroup && bloodGroup !== "all") {
      where.bloodGroup = bloodGroup;
    }

    if (hospital && hospital !== "all") {
      where.hospital = {
        contains: hospital,
      };
    }

    if (status && status !== "all") {
      where.transfusionStatus = status;
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { fullName: { contains: search.trim() } },
        { fighterId: { contains: search.trim() } },
        { hospital: { contains: search.trim() } },
        { assignedNgo: { contains: search.trim() } },
      ];
    }

    const fighters = await prisma.fighter.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: fighters.length,
      data: fighters,
    });
  } catch (error: any) {
    console.error("Error fetching fighters:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch fighters",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = fighterSchema.parse(body);

    // Auto-generate fighterId if not provided
    const fighterId =
      validatedData.fighterId && validatedData.fighterId.trim() !== ""
        ? validatedData.fighterId.trim().toUpperCase()
        : `SRDS-F-${Math.floor(1000 + Math.random() * 9000)}`;

    // Check if fighterId already exists
    const existing = await prisma.fighter.findUnique({
      where: { fighterId },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Fighter ID "${fighterId}" already exists. Please choose a different ID.`,
        },
        { status: 409 }
      );
    }

    const fighter = await prisma.fighter.create({
      data: {
        fighterId,
        fullName: validatedData.fullName,
        dateOfBirth: validatedData.dateOfBirth
          ? new Date(validatedData.dateOfBirth)
          : null,
        gender: validatedData.gender || null,
        bloodGroup: validatedData.bloodGroup || null,
        hospital: validatedData.hospital || null,
        assignedNgo: validatedData.assignedNgo || null,
        transfusionStatus: validatedData.transfusionStatus || "Stable",
        lastTransfusion: validatedData.lastTransfusion
          ? new Date(validatedData.lastTransfusion)
          : null,
        nextDue: validatedData.nextDue ? new Date(validatedData.nextDue) : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Fighter registered successfully",
        data: fighter,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering fighter:", error);
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
        error: "Failed to register fighter",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
