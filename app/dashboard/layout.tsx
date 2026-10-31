"use client";

import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; email: string }>({
    name: "SRDS Administrator",
    email: "admin@srds.org",
  });
  const [counts, setCounts] = useState<{
    dueFighters?: number;
    pendingApplications?: number;
    activeDispatches?: number;
    activeCamps?: number;
  }>({});
  const [loading, setLoading] = useState(false);

  const fetchStatsAndAdmin = useCallback(async () => {
    setLoading(true);
    try {
      const [adminRes, statsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/stats"),
      ]);

      if (adminRes.ok) {
        const adminData = await adminRes.json();
        if (adminData.success && adminData.admin) {
          setAdmin(adminData.admin);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.data) {
          setCounts({
            dueFighters: (statsData.data.criticalFighters || 0) + (statsData.data.dueFighters || 0),
            pendingApplications: statsData.data.pendingApplications || 0,
            activeDispatches: statsData.data.activeDispatches || 0,
            activeCamps: statsData.data.activeCamps || 0,
          });
        }
      }
    } catch (err) {
      console.error("Dashboard layout data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatsAndAdmin();
  }, [fetchStatsAndAdmin]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40">
        <Sidebar
          adminName={admin.name}
          adminEmail={admin.email}
          counts={counts}
        />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10 shadow-2xl">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              adminName={admin.name}
              adminEmail={admin.email}
              counts={counts}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 min-w-0">
        <DashboardHeader
          onToggleMobile={() => setMobileSidebarOpen(true)}
          onRefresh={fetchStatsAndAdmin}
          loading={loading}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

