"use client";

import { AlertTriangle, Clock, Droplet, ArrowRight, Building2 } from "lucide-react";

interface Fighter {
  id: number;
  fighterId: string;
  fullName: string;
  bloodGroup: string | null;
  hospital: string | null;
  transfusionStatus: string | null;
  nextDue: string | null;
}

interface Props {
  transfusions: Fighter[];
  onSelectFighter?: (f: Fighter) => void;
}

export default function UpcomingTransfusionsCard({
  transfusions,
  onSelectFighter,
}: Props) {
  if (!transfusions || transfusions.length === 0) {
    return null;
  }

  const formatDays = (dateStr: string | null) => {
    if (!dateStr) return "Scheduled";
    const due = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return (
        <span className="text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded text-[10px]">
          Overdue ({Math.abs(diffDays)}d)
        </span>
      );
    }
    if (diffDays === 0) {
      return (
        <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">
          Due Today
        </span>
      );
    }
    return (
      <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-[10px]">
        In {diffDays} days
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/80 via-white to-rose-50/50 p-5 rounded-2xl border border-amber-200/70 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Urgent Transfusion Action Alert
            </h3>
            <p className="text-xs text-gray-500">
              Fighters requiring immediate donor matching and hospital coordination
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {transfusions.slice(0, 6).map((f) => (
          <div
            key={f.id}
            onClick={() => onSelectFighter && onSelectFighter(f)}
            className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-rose-200 hover:shadow transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-gray-900 text-xs group-hover:text-rose-600 transition-colors">
                  {f.fullName}
                </p>
                <p className="text-[11px] font-mono text-gray-400">
                  {f.fighterId}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-extrabold text-xs">
                <Droplet className="w-3 h-3 fill-rose-600" />
                {f.bloodGroup || "N/A"}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 text-gray-500 truncate max-w-[140px]">
                <Building2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{f.hospital || "Civil/NICH"}</span>
              </div>
              {formatDays(f.nextDue)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
