import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  try {
    const today = new Date();
    const daysAgo = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    const daysAhead = (days: number) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    // 1. Ensure Default Admin with valid hashed password
    const hashedPassword = await hashPassword("admin123");
    await prisma.admin.upsert({
      where: { email: "admin@srds.org" },
      update: {
        password: hashedPassword,
        name: "SRDS Administrator",
      },
      create: {
        name: "SRDS Administrator",
        email: "admin@srds.org",
        password: hashedPassword,
      },
    });

    // 2. Check if operational data already exists
    const fighterCount = await prisma.fighter.count();
    const donorCount = await prisma.donor.count();
    const teamCount = await prisma.teamRegistration.count();

    if (fighterCount === 0) {
      await prisma.fighter.createMany({
        data: [
          {
            fighterId: "SRDS-F-1001",
            fullName: "Ayaan Ahmed",
            dateOfBirth: new Date("2016-04-12"),
            gender: "Male",
            bloodGroup: "O+",
            hospital: "National Institute of Child Health (NICH)",
            assignedNgo: "SRDS Main Chapter",
            transfusionStatus: "Transfusion Due",
            lastTransfusion: daysAgo(18),
            nextDue: daysAhead(1),
          },
          {
            fighterId: "SRDS-F-1002",
            fullName: "Fatima Noor",
            dateOfBirth: new Date("2018-09-24"),
            gender: "Female",
            bloodGroup: "B+",
            hospital: "Civil Hospital Blood Center",
            assignedNgo: "Afzaal Memorial Thalassemia Foundation",
            transfusionStatus: "Stable",
            lastTransfusion: daysAgo(5),
            nextDue: daysAhead(16),
          },
          {
            fighterId: "SRDS-F-1003",
            fullName: "Muhammad Bilal",
            dateOfBirth: new Date("2014-11-03"),
            gender: "Male",
            bloodGroup: "AB-",
            hospital: "Indus Hospital & Health Network",
            assignedNgo: "SRDS Urgent Care",
            transfusionStatus: "Critical",
            lastTransfusion: daysAgo(25),
            nextDue: daysAgo(2),
          },
          {
            fighterId: "SRDS-F-1004",
            fullName: "Zainab Tariq",
            dateOfBirth: new Date("2019-01-15"),
            gender: "Female",
            bloodGroup: "A+",
            hospital: "Jinnah Postgraduate Medical Centre (JPMC)",
            assignedNgo: "Kashif Iqbal Thalassemia Care",
            transfusionStatus: "Stable",
            lastTransfusion: daysAgo(8),
            nextDue: daysAhead(12),
          },
          {
            fighterId: "SRDS-F-1005",
            fullName: "Hamza Farooq",
            dateOfBirth: new Date("2015-06-30"),
            gender: "Male",
            bloodGroup: "O-",
            hospital: "Liaquat National Hospital",
            assignedNgo: "SRDS South Zone",
            transfusionStatus: "Transfusion Due",
            lastTransfusion: daysAgo(21),
            nextDue: daysAhead(2),
          },
        ],
      });
    }

    if (donorCount === 0) {
      await prisma.donor.createMany({
        data: [
          {
            donorName: "Rashid Mahmood",
            contactNumber: "+92 300 1234567",
            bloodGroup: "O+",
            districtCovered: "Karachi Central",
            donationDate: daysAgo(105),
          },
          {
            donorName: "Shahida Parveen",
            contactNumber: "+92 321 9876543",
            bloodGroup: "B+",
            districtCovered: "Karachi South",
            donationDate: daysAgo(95),
          },
          {
            donorName: "Arsalan Khan",
            contactNumber: "+92 333 4567890",
            bloodGroup: "AB-",
            districtCovered: "Karachi East",
            donationDate: daysAgo(15),
          },
          {
            donorName: "Kamran Akram",
            contactNumber: "+92 312 6543210",
            bloodGroup: "O-",
            districtCovered: "Karachi West",
            donationDate: daysAgo(110),
          },
          {
            donorName: "Naveed Qureshi",
            contactNumber: "+92 345 7890123",
            bloodGroup: "A+",
            districtCovered: "Korangi",
            donationDate: daysAgo(30),
          },
          {
            donorName: "Dr. Asim Siddiqui",
            contactNumber: "+92 301 2345678",
            bloodGroup: "A-",
            districtCovered: "Malir",
            donationDate: daysAgo(120),
          },
        ],
      });
    }

    if (teamCount === 0) {
      await prisma.teamRegistration.createMany({
        data: [
          {
            fullName: "Sumaira Iqbal",
            phoneNumber: "+92 331 1122334",
            roleApplied: "Donor Coordinator",
            status: "Pending",
          },
          {
            fullName: "Danish Raza",
            phoneNumber: "+92 302 5566778",
            roleApplied: "Emergency Blood Dispatcher",
            status: "Approved",
          },
          {
            fullName: "Areeba Siddiqui",
            phoneNumber: "+92 315 9988776",
            roleApplied: "Medical & Hospital Liaison",
            status: "Pending",
          },
          {
            fullName: "Waqas Alam",
            phoneNumber: "+92 344 3344556",
            roleApplied: "Awareness & Camp Organizer",
            status: "Pending",
          },
        ],
      });
    }

    // 3. Seed Camps if empty
    const campsCount = await prisma.campSchedule.count();
    if (campsCount === 0) {
      await prisma.campSchedule.createMany({
        data: [
          {
            campTitle: "NED University Mega Blood Drive",
            location: "Student Activity Center, NED Main Campus",
            targetCity: "Karachi",
            campDate: daysAhead(5),
            targetBags: 100,
            collectedBags: 0,
            coordinatorName: "Engr. Danish Raza",
            contactNumber: "+92 302 5566778",
            status: "Scheduled",
          },
          {
            campTitle: "Clifton Community Center Thalassemia Drive",
            location: "Hall B, Clifton Block 4",
            targetCity: "Karachi",
            campDate: daysAhead(12),
            targetBags: 60,
            collectedBags: 0,
            coordinatorName: "Sumaira Iqbal",
            contactNumber: "+92 331 1122334",
            status: "Scheduled",
          },
          {
            campTitle: "Jinnah Sindh Medical University Camp",
            location: "JSMU Old Auditorium",
            targetCity: "Karachi",
            campDate: daysAgo(10),
            targetBags: 80,
            collectedBags: 84,
            coordinatorName: "Areeba Siddiqui",
            contactNumber: "+92 315 9988776",
            status: "Completed",
          },
        ],
      });
    }

    // 4. Seed Dispatches if empty
    const dispatchCount = await prisma.donorDispatch.count();
    if (dispatchCount === 0) {
      await prisma.donorDispatch.createMany({
        data: [
          {
            fighterId: "SRDS-F-1003",
            fighterName: "Muhammad Bilal",
            donorName: "Arsalan Khan",
            donorPhone: "+92 333 4567890",
            bloodGroup: "AB-",
            hospital: "Indus Hospital & Health Network",
            urgency: "Immediate",
            status: "En Route",
            notes: "Urgent red cells needed for platelet low emergency.",
          },
          {
            fighterId: "SRDS-F-1001",
            fighterName: "Ayaan Ahmed",
            donorName: "Rashid Mahmood",
            donorPhone: "+92 300 1234567",
            bloodGroup: "O+",
            hospital: "National Institute of Child Health (NICH)",
            urgency: "Within 24h",
            status: "Dispatched",
            notes: "Scheduled monthly transfusion cycle.",
          },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database successfully seeded with Admin credentials (admin@srds.org / admin123) and sample clinical records!",
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed data", details: error.message },
      { status: 500 }
    );
  }
}
