"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Truck,
  Tent,
  ShieldAlert,
  Droplet,
  Users,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
} from "lucide-react";
import OverviewCards from "@/components/dashboard/OverviewCards";
import UpcomingTransfusionsCard from "@/components/dashboard/UpcomingTransfusionsCard";
import { useRouter } from "next/navigation";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, dispatchesRes, campsRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/dispatches"),
        fetch("/api/camps"),
      ]);

      const [statsData, dispatchesData, campsData] = await Promise.all([
        statsRes.json(),
        dispatchesRes.json(),
        campsRes.json(),
      ]);

      if (statsData.success) setMetrics(statsData.data);
      if (dispatchesData.success) setDispatches(dispatchesData.data.slice(0, 4));
      if (campsData.success) setCamps(campsData.data.slice(0, 3));
    } catch (err) {
      console.error("Dashboard overview fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Sarioon Red Drop Society (SRDS) • Field Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Clinical Operations & Donor Logistics Hub
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            Real-time management for Thalassemia & blood disorder fighters, donor
            compatibility matching, emergency ambulance dispatches, and public blood camps.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/dashboard/matching"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-md shadow-rose-950 transition-all group"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Launch Patient-Donor Matching</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/dashboard/dispatches"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Emergency Dispatches</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <OverviewCards metrics={metrics} loading={loading} />

      {/* Urgent Transfusion Alerts */}
      {metrics?.upcomingTransfusions && metrics.upcomingTransfusions.length > 0 && (
        <UpcomingTransfusionsCard
          transfusions={metrics.upcomingTransfusions}
          onSelectFighter={(f) => {
            router.push(`/dashboard/matching?fighterId=${f.fighterId}`);
          }}
        />
      )}

      {/* Modular Operational Launchers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Operational Management Modules
            </h2>
            <p className="text-xs text-gray-500">
              Access specialized consoles for patient matching, donor dispatches, and drives.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Patient Matching */}
          <Link
            href="/dashboard/matching"
            className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-rose-200 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-rose-600 transition-colors">
                Patient Matching Engine
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Match fighters with compatible, eligible donors based on ABO/Rh antigens and proximity.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>Run Matching Diagnostics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Donor Dispatches */}
          <Link
            href="/dashboard/dispatches"
            className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-amber-200 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-amber-600 transition-colors">
                Donor Field Dispatches
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Log and track emergency donor dispatches to partner hospitals (NICH, JPMC, Civil Hospital).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>View Active Dispatches</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Camp Schedules */}
          <Link
            href="/dashboard/camps"
            className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Tent className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-600 transition-colors">
                Blood Donation Camps
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Organize public blood donation drives at universities and centers; monitor target bag goals.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Manage Camp Drives</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Fighters Clinical Registry */}
          <Link
            href="/dashboard/fighters"
            className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-red-200 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-red-600 transition-colors">
                Fighters Clinical Registry
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Maintain patient medical profiles, transfusion cycles, NGO links, and critical flags.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-red-600">
              <span>Open Patient Registry</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Donors Directory */}
          <Link
            href="/dashboard/donors"
            className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-rose-200 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Droplet className="w-6 h-6 fill-rose-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-rose-600 transition-colors">
                Voluntary Donors Directory
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Search verified donors by blood group, active districts, and 90-day rest eligibility.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>Browse Donors</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Team Reviews */}
          <Link
            href="/dashboard/team"
            className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition-colors">
                Team & Volunteer Reviews
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Approve, reject, or onboard field volunteers, liaisons, and camp organizers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>Review Applications</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Split Section: Recent Dispatches & Upcoming Camps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Dispatches */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">
                Recent Donor Dispatches
              </h3>
            </div>
            <Link
              href="/dashboard/dispatches"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {dispatches.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              No dispatches recorded yet. Use Patient Matching to dispatch donors.
            </div>
          ) : (
            <div className="space-y-3">
              {dispatches.map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {d.donorName} → {d.fighterName}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-extrabold text-[10px]">
                        {d.bloodGroup}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {d.hospital} • {d.urgency}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      d.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : d.status === "En Route"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Blood Camps */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Tent className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">
                Scheduled Blood Drives & Camps
              </h3>
            </div>
            <Link
              href="/dashboard/camps"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {camps.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              No blood camps scheduled yet.
            </div>
          ) : (
            <div className="space-y-3">
              {camps.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-gray-900">{c.campTitle}</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {c.location} • {new Date(c.campDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-700">
                      {c.collectedBags}/{c.targetBags} bags
                    </span>
                    <p className="text-[10px] text-gray-400">{c.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
