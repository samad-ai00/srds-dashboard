"use client";

import { Droplet, Users, ShieldAlert, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Metrics {
  totalFighters: number;
  criticalFighters: number;
  dueFighters: number;
  stableFighters: number;
  totalDonors: number;
  pendingApplications: number;
  approvedTeam: number;
}

interface Props {
  metrics: Metrics | null;
  loading: boolean;
}

export default function OverviewCards({ metrics, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-8 bg-gray-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Registered Fighters",
      value: metrics?.totalFighters ?? 0,
      subtext: `${metrics?.stableFighters ?? 0} currently stable`,
      icon: ShieldAlert,
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50",
      badgeColor: "bg-rose-100 text-rose-800",
    },
    {
      title: "Transfusions Due / Critical",
      value: (metrics?.dueFighters ?? 0) + (metrics?.criticalFighters ?? 0),
      subtext: `${metrics?.criticalFighters ?? 0} urgent critical cases`,
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      title: "Voluntary Donors Network",
      value: metrics?.totalDonors ?? 0,
      subtext: "Across active city districts",
      icon: Droplet,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      badgeColor: "bg-red-100 text-red-800",
    },
    {
      title: "Pending Team Applications",
      value: metrics?.pendingApplications ?? 0,
      subtext: `${metrics?.approvedTeam ?? 0} active team members`,
      icon: Users,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      badgeColor: "bg-indigo-100 text-indigo-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
                  {card.value}
                </p>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  {card.subtext}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${card.bgColor} ${card.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
