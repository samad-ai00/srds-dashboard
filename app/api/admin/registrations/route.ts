import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { fullName: { contains: search.trim() } },
        { phoneNumber: { contains: search.trim() } },
        { roleApplied: { contains: search.trim() } },
      ];
    }

    const registrations = await prisma.teamRegistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error: any) {
    console.error("Error fetching team registrations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team registrations",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
