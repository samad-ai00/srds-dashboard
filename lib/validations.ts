import { z } from "zod";

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const TRANSFUSION_STATUSES = [
  "Stable",
  "Transfusion Due",
  "Critical",
] as const;

export const TEAM_ROLES = [
  "Volunteer",
  "Donor Coordinator",
  "Medical & Hospital Liaison",
  "Awareness & Camp Organizer",
  "Emergency Blood Dispatcher",
  "Logistics & Operations",
] as const;

// Compatibility mapping: who can receive from whom
// Blood Group Compatibility: key = recipient (Fighter), value = list of compatible donor blood groups
export const BLOOD_COMPATIBILITY_RECIPIENT_MAP: Record<string, string[]> = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // Universal recipient
  "AB-": ["AB-", "A-", "B-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"], // Universal donor only receives O-
};

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export const createAdminSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateAdminProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().trim().email("Please enter a valid email address").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional(),
});

export const fighterSchema = z.object({
  fighterId: z.string().trim().min(2, "Fighter ID or Card Number is required").optional(),
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  bloodGroup: z.string().trim().min(1, "Blood group is required"),
  hospital: z.string().optional().nullable(),
  assignedNgo: z.string().optional().nullable(),
  transfusionStatus: z.enum(["Stable", "Transfusion Due", "Critical"]).default("Stable"),
  lastTransfusion: z.string().optional().nullable(),
  nextDue: z.string().optional().nullable(),
});

export const fighterUpdateSchema = z.object({
  transfusionStatus: z.enum(["Stable", "Transfusion Due", "Critical"]).optional(),
  lastTransfusion: z.string().optional().nullable(),
  nextDue: z.string().optional().nullable(),
  hospital: z.string().optional().nullable(),
  assignedNgo: z.string().optional().nullable(),
  bloodGroup: z.string().optional(),
  fullName: z.string().optional(),
});

export const donorSchema = z.object({
  donorName: z.string().trim().min(2, "Donor name must be at least 2 characters"),
  contactNumber: z.string().trim().min(7, "Valid contact number is required"),
  bloodGroup: z.string().trim().min(1, "Please select blood group"),
  districtCovered: z.string().trim().min(2, "District/City is required"),
  donationDate: z.string().optional().nullable(),
});

export const teamRegistrationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().trim().min(7, "Valid phone number is required"),
  roleApplied: z.string().trim().min(2, "Please select or enter the role applied for"),
  status: z.enum(["Pending", "Approved", "Rejected"]).default("Pending"),
});

export const registrationStatusUpdateSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected"]),
});

export const campScheduleSchema = z.object({
  campTitle: z.string().trim().min(3, "Camp title is required"),
  location: z.string().trim().min(3, "Camp location is required"),
  targetCity: z.string().trim().min(2, "City is required"),
  campDate: z.string().min(1, "Camp date is required"),
  targetBags: z.coerce.number().min(1, "Target bags must be at least 1").default(50),
  collectedBags: z.coerce.number().min(0).default(0),
  coordinatorName: z.string().trim().min(2, "Coordinator name is required"),
  contactNumber: z.string().trim().min(7, "Valid contact number is required"),
  status: z.enum(["Scheduled", "In Progress", "Completed", "Cancelled"]).default("Scheduled"),
});

export const donorDispatchSchema = z.object({
  fighterId: z.string().trim().min(1, "Fighter ID is required"),
  fighterName: z.string().trim().min(1, "Fighter name is required"),
  donorId: z.coerce.number().optional().nullable(),
  donorName: z.string().trim().min(1, "Donor name is required"),
  donorPhone: z.string().trim().min(7, "Valid donor phone is required"),
  bloodGroup: z.string().trim().min(1, "Blood group is required"),
  hospital: z.string().trim().min(2, "Hospital name is required"),
  urgency: z.enum(["Immediate", "Within 24h", "Routine"]).default("Immediate"),
  status: z.enum(["Dispatched", "En Route", "Blood Collected", "Completed", "Cancelled"]).default("Dispatched"),
  notes: z.string().optional().nullable(),
});
