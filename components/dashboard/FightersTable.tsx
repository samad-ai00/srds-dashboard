"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  Droplet,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BLOOD_GROUPS, TRANSFUSION_STATUSES } from "@/lib/validations";
import FighterEditModal from "./FighterEditModal";

interface Fighter {
  id: number;
  fighterId: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: string | null;
  bloodGroup: string | null;
  hospital: string | null;
  assignedNgo: string | null;
  transfusionStatus: string | null;
  lastTransfusion: string | null;
  nextDue: string | null;
  createdAt: string;
}

interface Props {
  fighters: Fighter[];
  loading: boolean;
  onRefresh: () => void;
  onOpenRegisterModal: () => void;
}

export default function FightersTable({
  fighters,
  loading,
  onRefresh,
  onOpenRegisterModal,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedHospital, setSelectedHospital] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editingFighter, setEditingFighter] = useState<Fighter | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Extract unique hospitals for filter
  const uniqueHospitals = Array.from(
    new Set(fighters.map((f) => f.hospital).filter(Boolean))
  ) as string[];

  // Filter fighters client-side or combined
  const filteredFighters = fighters.filter((f) => {
    const matchesSearch =
      search === "" ||
      f.fullName.toLowerCase().includes(search.toLowerCase()) ||
      f.fighterId.toLowerCase().includes(search.toLowerCase()) ||
      (f.hospital && f.hospital.toLowerCase().includes(search.toLowerCase())) ||
      (f.assignedNgo && f.assignedNgo.toLowerCase().includes(search.toLowerCase()));

    const matchesBlood =
      selectedBloodGroup === "all" || f.bloodGroup === selectedBloodGroup;

    const matchesStatus =
      selectedStatus === "all" || f.transfusionStatus === selectedStatus;

    const matchesHospital =
      selectedHospital === "all" || f.hospital === selectedHospital;

    return matchesSearch && matchesBlood && matchesStatus && matchesHospital;
  });

  const totalPages = Math.max(1, Math.ceil(filteredFighters.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedFighters = filteredFighters.slice(startIndex, startIndex + pageSize);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete fighter record "${name}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/fighters/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefresh();
      } else {
        alert("Failed to delete fighter record");
      }
    } catch (err) {
      alert("Error deleting record");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            Critical
          </span>
        );
      case "Transfusion Due":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Transfusion Due
          </span>
        );
      case "Stable":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Stable
          </span>
        );
    }
  };

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return <span className="text-gray-400">Not set</span>;
    const due = new Date(dateStr);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatted = due.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (diffDays < 0) {
      return (
        <div>
          <span className="text-red-700 font-bold block">{formatted}</span>
          <span className="text-[11px] text-red-600 font-medium">
            Overdue by {Math.abs(diffDays)} day{Math.abs(diffDays) === 1 ? "" : "s"}!
          </span>
        </div>
      );
    } else if (diffDays === 0) {
      return (
        <div>
          <span className="text-amber-700 font-bold block">{formatted}</span>
          <span className="text-[11px] text-amber-600 font-medium">Due Today!</span>
        </div>
      );
    } else if (diffDays <= 3) {
      return (
        <div>
          <span className="text-amber-800 font-semibold block">{formatted}</span>
          <span className="text-[11px] text-amber-600 font-medium">
            Due in {diffDays} day{diffDays === 1 ? "" : "s"}
          </span>
        </div>
      );
    }

    return (
      <div>
        <span className="text-gray-700 font-medium block">{formatted}</span>
        <span className="text-[11px] text-gray-400">In {diffDays} days</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 border-b border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>Fighters (Blood Disorder Patients)</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                {filteredFighters.length} records
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              Manage patient clinical profiles, hospitals, and routine transfusion intervals.
            </p>
          </div>

          <button
            onClick={onOpenRegisterModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Fighter</span>
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Blood Group Filter */}
          <div>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            >
              <option value="all">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  Blood Group: {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            >
              <option value="all">All Transfusion Statuses</option>
              {TRANSFUSION_STATUSES.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Hospital Filter */}
          <div>
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            >
              <option value="all">All Hospitals</option>
              {uniqueHospitals.map((hosp) => (
                <option key={hosp} value={hosp}>
                  {hosp}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="py-3 px-4">Fighter Info</th>
              <th className="py-3 px-4">Blood Group</th>
              <th className="py-3 px-4">Hospital & NGO</th>
              <th className="py-3 px-4">Transfusion Status</th>
              <th className="py-3 px-4">Last Transfusion</th>
              <th className="py-3 px-4">Next Due Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  Loading fighters...
                </td>
              </tr>
            ) : filteredFighters.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-gray-700">No fighters found</p>
                    <p className="text-xs text-gray-400">
                      Try adjusting your search criteria or register a new patient.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedFighters.map((f) => (
                <tr
                  key={f.id}
                  className="hover:bg-rose-50/30 transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">{f.fullName}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                      <span className="font-mono font-semibold text-rose-600">
                        {f.fighterId}
                      </span>
                      {f.gender && <span>• {f.gender}</span>}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold border border-rose-100">
                      <Droplet className="w-3 h-3 fill-rose-600" />
                      {f.bloodGroup || "Unknown"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-800 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate max-w-[180px]">
                        {f.hospital || "Not Assigned"}
                      </span>
                    </div>
                    {f.assignedNgo && (
                      <div className="text-[11px] text-gray-400 truncate max-w-[180px]">
                        {f.assignedNgo}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {getStatusBadge(f.transfusionStatus)}
                  </td>

                  <td className="py-3.5 px-4 text-gray-600">
                    {f.lastTransfusion ? (
                      new Date(f.lastTransfusion).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    ) : (
                      <span className="text-gray-400">No record</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {formatDueDate(f.nextDue)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingFighter(f)}
                        title="Update schedule & status"
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(f.id, f.fullName)}
                        disabled={deletingId === f.id}
                        title="Delete record"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredFighters.length > 0 && (
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <strong className="text-gray-900 font-bold">
                {startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-gray-900 font-bold">
                {Math.min(startIndex + pageSize, filteredFighters.length)}
              </strong>{" "}
              of{" "}
              <strong className="text-gray-900 font-bold">
                {filteredFighters.length}
              </strong>{" "}
              patients
            </span>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1 px-2 rounded-lg bg-white border border-gray-200 text-gray-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            <span className="px-2.5 py-1 font-bold text-gray-900">
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingFighter && (
        <FighterEditModal
          fighter={editingFighter}
          isOpen={true}
          onClose={() => setEditingFighter(null)}
          onUpdated={() => {
            onRefresh();
            setEditingFighter(null);
          }}
        />
      )}
    </div>
  );
}
