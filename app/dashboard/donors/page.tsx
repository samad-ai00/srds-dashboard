"use client";

import { useEffect, useState } from "react";
import DonorsTable from "@/components/dashboard/DonorsTable";
import QuickAddModal from "@/components/dashboard/QuickAddModal";
import { Droplet, Plus, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function DonorsPage() {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickAddModal, setQuickAddModal] = useState(false);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/donors");
      const json = await res.json();
      if (json.success) {
        setDonors(json.data);
      }
    } catch (err) {
      console.error("Error fetching donors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 mb-1">
            <Droplet className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>Voluntary Blood Donors Network</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Donors Directory & Eligibility Tracker
          </h1>
          <p className="text-xs text-gray-500">
            Verify ABO/Rh donor records, track 90-day rest cycles, and coordinate dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/matching"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>Match With Patient</span>
          </Link>

          <button
            onClick={() => setQuickAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold shadow-sm shadow-rose-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Donor</span>
          </button>
        </div>
      </div>

      {/* Donors Table */}
      <DonorsTable
        donors={donors}
        loading={loading}
        onRefresh={fetchDonors}
        onOpenRegisterModal={() => setQuickAddModal(true)}
      />

      <QuickAddModal
        isOpen={quickAddModal}
        defaultTab="donor"
        onClose={() => setQuickAddModal(false)}
        onAdded={fetchDonors}
      />
    </div>
  );
}

