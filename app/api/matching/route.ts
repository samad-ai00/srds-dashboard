import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BLOOD_COMPATIBILITY_RECIPIENT_MAP } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fighterId = searchParams.get("fighterId");
    const districtFilter = searchParams.get("district");

    if (fighterId) {
      // Find fighter
      const fighter = await prisma.fighter.findFirst({
        where: {
          OR: [
            { fighterId: fighterId },
            ...(isNaN(Number(fighterId)) ? [] : [{ id: Number(fighterId) }]),
          ],
        },
      });

      if (!fighter) {
        return NextResponse.json(
          { success: false, error: "Fighter not found" },
          { status: 404 }
        );
      }

      // Determine compatible donor blood groups
      const compatibleGroups =
        BLOOD_COMPATIBILITY_RECIPIENT_MAP[fighter.bloodGroup] || [fighter.bloodGroup];

      const donorWhere: any = {
        bloodGroup: { in: compatibleGroups },
      };

      if (districtFilter && districtFilter !== "all") {
        donorWhere.districtCovered = { contains: districtFilter };
      }

      const donors = await prisma.donor.findMany({
        where: donorWhere,
        orderBy: { donationDate: "asc" }, // oldest donation first (most rested)
      });

      // Calculate eligibility (typically 90 days between donations)
      const now = new Date().getTime();
      const mappedDonors = donors.map((d) => {
        let isEligible = true;
        let daysSinceDonation: number | null = null;
        if (d.donationDate) {
          const diff = now - new Date(d.donationDate).getTime();
          daysSinceDonation = Math.floor(diff / (1000 * 60 * 60 * 24));
          isEligible = daysSinceDonation >= 90;
        }

        // District match score
        const isDistrictMatch =
          fighter.assignedNgo?.toLowerCase().includes(d.districtCovered?.toLowerCase() || "") ||
          false;

        return {
          ...d,
          daysSinceDonation,
          isEligible,
          isExactGroup: d.bloodGroup === fighter.bloodGroup,
          isDistrictMatch,
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          fighter,
          compatibleGroups,
          matchedDonors: mappedDonors,
        },
      });
    }

    // If no fighterId specified, list all fighters needing donors
    const needyFighters = await prisma.fighter.findMany({
      where: {
        OR: [
          { transfusionStatus: "Critical" },
          { transfusionStatus: "Transfusion Due" },
          {
            nextDue: {
              lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          },
        ],
      },
      orderBy: [{ transfusionStatus: "asc" }, { nextDue: "asc" }],
    });

    // Also get all donors count
    const allDonors = await prisma.donor.findMany();

    // Map fighters with quick match counts
    const fightersWithMatchCounts = needyFighters.map((f) => {
      const compatibleGroups =
        BLOOD_COMPATIBILITY_RECIPIENT_MAP[f.bloodGroup] || [f.bloodGroup];
      const matchCount = allDonors.filter((d) =>
        d.bloodGroup ? compatibleGroups.includes(d.bloodGroup) : false
      ).length;

      return {
        ...f,
        compatibleGroups,
        availableDonorCount: matchCount,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        fighters: fightersWithMatchCounts,
        totalEligibleDonors: allDonors.length,
      },
    });
  } catch (error: any) {
    console.error("Error in matching API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform clinical matching", details: error.message },
      { status: 500 }
    );
  }
}

