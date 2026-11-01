"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  HeartPulse,
  Truck,
  Tent,
  ShieldAlert,
  Droplet,
  Users,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  UserCheck,
  FileSpreadsheet,
  Download,
} from "lucide-react";

interface SidebarProps {
  adminName?: string;
  adminEmail?: string;
  counts?: {
    dueFighters?: number;
    pendingApplications?: number;
    activeDispatches?: number;
    activeCamps?: number;
  };
  onCloseMobile?: () => void;
}

export default function Sidebar({
  adminName = "SRDS Administrator",
  adminEmail = "admin@srds.org",
  counts,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Patient Matching",
      href: "/dashboard/matching",
      icon: HeartPulse,
      badge: counts?.dueFighters ? `${counts.dueFighters} Due` : undefined,
      badgeColor: "bg-rose-500 text-white",
    },
    {
      label: "Donor Dispatches",
      href: "/dashboard/dispatches",
      icon: Truck,
      badge: counts?.activeDispatches ? `${counts.activeDispatches}` : undefined,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      label: "Camp Schedules",
      href: "/dashboard/camps",
      icon: Tent,
      badge: counts?.activeCamps ? `${counts.activeCamps}` : undefined,
      badgeColor: "bg-emerald-500 text-white",
    },
    {
      label: "Fighters Registry",
      href: "/dashboard/fighters",
      icon: ShieldAlert,
    },
    {
      label: "Donors Directory",
      href: "/dashboard/donors",
      icon: Droplet,
    },
    {
      label: "Team Registrations",
      href: "/dashboard/team",
      icon: Users,
      badge: counts?.pendingApplications ? `${counts.pendingApplications}` : undefined,
      badgeColor: "bg-indigo-600 text-white",
    },
    {
      label: "Admin Profile",
      href: "/dashboard/profile",
      icon: UserCheck,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-full shrink-0 select-none">
      {/* Brand & Logo Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-900/50 group-hover:scale-105 transition-transform">
            <Droplet className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-white">
                SRDS
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Ops
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Sarioon Volunteers
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Operational Modules
        </div>

        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-rose-600 text-white shadow-md shadow-rose-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-rose-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-800/80 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Data Export & Tools
        </div>

        <a
          href="/api/export-excel"
          download
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/50 hover:text-emerald-200 transition-colors group mb-2"
        >
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Export to Excel / Sheet</span>
          </div>
          <Download className="w-3.5 h-3.5 text-emerald-400" />
        </a>

        <div className="pt-2 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Portals & Links
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Public Registration Portal</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
          <Link
            href="/dashboard/profile"
            onClick={onCloseMobile}
            title="View & Edit Admin Profile"
            className="flex items-center gap-2.5 min-w-0 hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-300 font-bold text-xs shrink-0">
              {adminName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-snug">
                {adminName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{adminEmail}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Sign out of Admin Dashboard"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

