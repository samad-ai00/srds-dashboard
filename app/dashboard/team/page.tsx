"use client";

import { useEffect, useState } from "react";
import TeamReviewer from "@/components/dashboard/TeamReviewer";
import { Users, Sparkles, ExternalLink, FileSpreadsheet, Download } from "lucide-react";
import Link from "next/link";

export default function TeamPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/registrations");
      const json = await res.json();
      if (json.success) {
        setRegistrations(json.data);
      }
    } catch (err) {
      console.error("Error fetching team registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 mb-1">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Volunteer & Staff Taskforce</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Team & Volunteer Applications Review
          </h1>
          <p className="text-xs text-gray-500">
            Review incoming volunteer applications, approve coordinators, and manage roles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/api/export-excel"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export All Records (Excel)</span>
          </a>

          <Link
            href="/#registration-section"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Application Form</span>
          </Link>
        </div>
      </div>

      {/* Team Reviewer Component */}
      <TeamReviewer
        registrations={registrations}
        loading={loading}
        onRefresh={fetchRegistrations}
      />
    </div>
  );
}

