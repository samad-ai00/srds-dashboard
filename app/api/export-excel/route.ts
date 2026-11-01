import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  try {
    const [donors, camps, teams, fighters, dispatches] = await Promise.all([
      prisma.donor.findMany({ orderBy: { id: "asc" } }),
      prisma.campSchedule.findMany({ orderBy: { campDate: "desc" } }),
      prisma.teamRegistration.findMany({ orderBy: { id: "asc" } }),
      prisma.fighter.findMany({ orderBy: { id: "asc" } }),
      prisma.donorDispatch.findMany({ orderBy: { id: "desc" } }),
    ]);

    const lines: string[] = [];

    // Helper for rows
    const addRow = (...cells: any[]) => {
      lines.push(cells.map(escapeCsvCell).join(","));
    };

    // --- SECTION 1: HEADER & SOCIETIES / TEAM REGISTRATIONS ---
    addRow("SARIOON RED DROP SOCIETY (SRDS) - LIVE DATABASE EXPORT");
    addRow("Export Date", new Date().toISOString().split("T")[0], "Total Donors", donors.length, "Total Camps", camps.length, "Team Members", teams.length, "Fighters", fighters.length);
    addRow("");

    addRow("SOCIETIES & TEAM REGISTRATIONS");
    addRow("SR No", "Full Name", "Contact Number", "Role / Applied Society", "Status", "Registered Date");
    teams.forEach((t, i) => {
      addRow(
        i + 1,
        t.fullName,
        t.phoneNumber,
        t.roleApplied,
        t.status,
        new Date(t.createdAt).toISOString().split("T")[0]
      );
    });
    addRow("");
    addRow("");

    // --- SECTION 2: FIGHTERS REGISTRY ---
    addRow("FIGHTERS CLINICAL REGISTRY (PATIENTS)");
    addRow("Fighter ID", "Fighter Name", "Gender", "Blood Group", "Hospital", "Assigned NGO", "Transfusion Status", "Last Transfusion", "Next Due");
    fighters.forEach((f) => {
      addRow(
        f.fighterId,
        f.fullName,
        f.gender || "N/A",
        f.bloodGroup,
        f.hospital || "N/A",
        f.assignedNgo || "SRDS Main",
        f.transfusionStatus,
        f.lastTransfusion ? new Date(f.lastTransfusion).toISOString().split("T")[0] : "",
        f.nextDue ? new Date(f.nextDue).toISOString().split("T")[0] : ""
      );
    });
    addRow("");
    addRow("");

    // --- SECTION 3: BLOOD DONOR REGISTRY & DONATION LOG ---
    const districts = Array.from(new Set(donors.map((d) => d.districtCovered).filter(Boolean)));
    addRow("BLOOD DONOR REGISTRY & DONATION LOG");
    addRow("TOTAL DONATIONS RECORDED", "PATIENT TRANSFUSIONS", "CAMP DONATIONS", "DISTRICTS COVERED");
    addRow(donors.length, dispatches.length, donors.length, districts.length || 1);
    addRow("");

    addRow("Donation ID", "Donation Date", "Donor Name", "Donor Contact", "Donor Blood Group", "District", "NGO Name", "Hospital / Center", "Case Description");
    donors.forEach((d, i) => {
      const donId = `SRDS-${5101 + i}`;
      addRow(
        donId,
        d.donationDate ? new Date(d.donationDate).toISOString().split("T")[0] : new Date(d.createdAt).toISOString().split("T")[0],
        d.donorName,
        d.contactNumber,
        d.bloodGroup || "Unknown",
        d.districtCovered || "General",
        "SARIOON Pakistan",
        "Sundas Foundation / Partner Center",
        "Blood Donation Camp Drive"
      );
    });
    addRow("");
    addRow("");

    // --- SECTION 4: BLOOD DONATION CAMPS & OUTREACH ---
    const upcomingCamps = camps.filter((c) => c.status === "Scheduled" || c.status === "In Progress").length;
    const totalTargetBags = camps.reduce((sum, c) => sum + (c.targetBags || 0), 0);
    const totalCollectedBags = camps.reduce((sum, c) => sum + (c.collectedBags || 0), 0);

    addRow("BLOOD DONATION CAMPS & OUTREACH TEAM");
    addRow("TOTAL CAMPAIGNS", "UPCOMING DRIVES", "TARGET BAGS GOAL", "UNITS / BAGS COLLECTED");
    addRow(camps.length, upcomingCamps, totalTargetBags, totalCollectedBags);
    addRow("");

    addRow("Campaign ID", "Campaign Title", "Location / Venue", "Target City", "Date", "Lead Coordinator", "Contact Number", "Target Bags", "Collected Bags", "Status");
    camps.forEach((c, idx) => {
      const cmpId = `CMP-2026-${String(idx + 1).padStart(3, "0")}`;
      addRow(
        cmpId,
        c.campTitle,
        c.location,
        c.targetCity,
        new Date(c.campDate).toISOString().split("T")[0],
        c.coordinatorName,
        c.contactNumber,
        c.targetBags,
        c.collectedBags,
        c.status
      );
    });
    addRow("");
    addRow("");

    // --- SECTION 5: EMERGENCY DONOR DISPATCHES ---
    if (dispatches.length > 0) {
      addRow("EMERGENCY FIELD DISPATCHES");
      addRow("Dispatch ID", "Fighter ID", "Fighter Name", "Donor Name", "Donor Phone", "Blood Group", "Hospital", "Urgency", "Status", "Dispatch Date", "Notes");
      dispatches.forEach((dp) => {
        addRow(
          `DSP-${dp.id}`,
          dp.fighterId,
          dp.fighterName,
          dp.donorName,
          dp.donorPhone,
          dp.bloodGroup,
          dp.hospital,
          dp.urgency,
          dp.status,
          new Date(dp.dispatchDate).toISOString().split("T")[0],
          dp.notes || ""
        );
      });
      addRow("");
    }

    // Prepend UTF-8 BOM so Microsoft Excel correctly renders all text formatting
    const csvContent = "\uFEFF" + lines.join("\r\n");
    const dateStr = new Date().toISOString().split("T")[0];

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="SRDS_Database_Export_${dateStr}.csv"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Export Excel error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate Excel/CSV export" },
      { status: 500 }
    );
  }
}
