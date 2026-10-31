import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { donorSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get("bloodGroup");
    const district = searchParams.get("district");
    const search = searchParams.get("search");

    const where: any = {};

    if (bloodGroup && bloodGroup !== "all") {
      where.bloodGroup = bloodGroup;
    }

    if (district && district !== "all") {
      where.districtCovered = {
        contains: district,
      };
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { donorName: { contains: search.trim() } },
        { contactNumber: { contains: search.trim() } },
        { districtCovered: { contains: search.trim() } },
      ];
    }

    const donors = await prisma.donor.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: donors.length,
      data: donors,
    });
  } catch (error: any) {
    console.error("Error fetching donors:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch donors",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = donorSchema.parse(body);

    const donor = await prisma.donor.create({
      data: {
        donorName: validatedData.donorName,
        contactNumber: validatedData.contactNumber,
        bloodGroup: validatedData.bloodGroup,
        districtCovered: validatedData.districtCovered,
        donationDate: validatedData.donationDate
          ? new Date(validatedData.donationDate)
          : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Donor registered successfully",
        data: donor,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering donor:", error);
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
        error: "Failed to register donor",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
