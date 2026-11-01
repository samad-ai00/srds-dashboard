"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Sparkles,
  Plus,
  RefreshCw,
  Bell,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import QuickAddModal from "@/components/dashboard/QuickAddModal";

interface HeaderProps {
  onToggleMobile: () => void;
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  loading?: boolean;
}

export default function DashboardHeader({
  onToggleMobile,
  title,
  subtitle,
  onRefresh,
  loading,
}: HeaderProps) {
  const [quickAddModal, setQuickAddModal] = useState<{
    open: boolean;
    tab: "fighter" | "donor";
  }>({ open: false, tab: "fighter" });

  const [seeding, setSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  const handleSeedDemoData = async () => {
    setSeeding(true);
    setSeedNotice(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setSeedNotice(data.message || "Data seeded successfully");
      if (onRefresh) onRefresh();
      setTimeout(() => setSeedNotice(null), 4000);
    } catch (err) {
      alert("Error seeding sample data");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobile}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                {title || "SRDS Operations Control"}
              </h1>
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {seedNotice && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{seedNotice}</span>
            </div>
          )}

          <a
            href="/api/export-excel"
            download
            title="Download live database as Excel / CSV"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Export Excel</span>
          </a>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh live metrics"
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading ? "animate-spin text-rose-600" : ""
                }`}
              />
            </button>
          )}

          <Link
            href="/dashboard/profile"
            title="Admin Profile & Security"
            className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:text-rose-600 hover:bg-gray-50 transition-colors"
          >
            <UserCheck className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setQuickAddModal({ open: true, tab: "fighter" })}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold shadow-sm shadow-rose-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Register</span>
          </button>
        </div>
      </header>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddModal.open}
        defaultTab={quickAddModal.tab}
        onClose={() => setQuickAddModal({ ...quickAddModal, open: false })}
        onAdded={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </>
  );
}

