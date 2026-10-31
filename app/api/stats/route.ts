import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalFighters,
      criticalFighters,
      dueFighters,
      stableFighters,
      totalDonors,
      pendingApplications,
      approvedTeam,
      activeCamps,
      activeDispatches,
      recentDonors,
      upcomingTransfusions,
    ] = await Promise.all([
      prisma.fighter.count(),
      prisma.fighter.count({ where: { transfusionStatus: "Critical" } }),
      prisma.fighter.count({ where: { transfusionStatus: "Transfusion Due" } }),
      prisma.fighter.count({ where: { transfusionStatus: "Stable" } }),
      prisma.donor.count(),
      prisma.teamRegistration.count({ where: { status: "Pending" } }),
      prisma.teamRegistration.count({ where: { status: "Approved" } }),
      prisma.campSchedule.count({ where: { status: "Scheduled" } }),
      prisma.donorDispatch.count({ where: { status: { in: ["Dispatched", "En Route"] } } }),
      prisma.donor.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.fighter.findMany({
        where: {
          OR: [
            { transfusionStatus: "Transfusion Due" },
            { transfusionStatus: "Critical" },
            {
              nextDue: {
                lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
              },
            },
          ],
        },
        take: 10,
        orderBy: { nextDue: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalFighters,
        criticalFighters,
        dueFighters,
        stableFighters,
        totalDonors,
        pendingApplications,
        approvedTeam,
        activeCamps,
        activeDispatches,
        recentDonors,
        upcomingTransfusions,
      },
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard metrics",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
