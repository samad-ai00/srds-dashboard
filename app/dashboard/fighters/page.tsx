"use client";

import { useEffect, useState } from "react";
import FightersTable from "@/components/dashboard/FightersTable";
import QuickAddModal from "@/components/dashboard/QuickAddModal";
import { ShieldAlert, Plus, Sparkles, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function FightersPage() {
  const [fighters, setFighters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickAddModal, setQuickAddModal] = useState(false);

  const fetchFighters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fighters");
      const json = await res.json();
      if (json.success) {
        setFighters(json.data);
      }
    } catch (err) {
      console.error("Error fetching fighters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFighters();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Clinical Blood Disorder Registry</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Fighters & Patients Management
          </h1>
          <p className="text-xs text-gray-500">
            Monitor transfusion schedules, hospital centers, and patient health status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/matching"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>Open Matching Engine</span>
          </Link>

          <button
            onClick={() => setQuickAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold shadow-sm shadow-rose-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Fighter</span>
          </button>
        </div>
      </div>

      {/* Fighters Table */}
      <FightersTable
        fighters={fighters}
        loading={loading}
        onRefresh={fetchFighters}
        onOpenRegisterModal={() => setQuickAddModal(true)}
      />

      <QuickAddModal
        isOpen={quickAddModal}
        defaultTab="fighter"
        onClose={() => setQuickAddModal(false)}
        onAdded={fetchFighters}
      />
    </div>
  );
}

