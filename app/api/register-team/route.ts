import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamRegistrationSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = teamRegistrationSchema.parse(body);

    const registration = await prisma.teamRegistration.create({
      data: {
        fullName: validatedData.fullName,
        phoneNumber: validatedData.phoneNumber,
        roleApplied: validatedData.roleApplied,
        status: validatedData.status || "Pending",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Volunteer application submitted successfully! Our team will contact you soon.",
        data: registration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting team registration:", error);
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
        error: "Failed to submit registration",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
