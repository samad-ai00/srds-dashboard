"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  ShieldCheck,
  Trash2,
  Loader2,
  Users,
} from "lucide-react";

interface TeamRegistration {
  id: number;
  fullName: string;
  phoneNumber: string;
  roleApplied: string;
  status: string;
  createdAt: string;
}

interface Props {
  registrations: TeamRegistration[];
  loading: boolean;
  onRefresh: () => void;
}

export default function TeamReviewer({
  registrations,
  loading,
  onRefresh,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Filter registrations
  const filtered = registrations.filter((r) => {
    const matchesSearch =
      search === "" ||
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.phoneNumber.includes(search) ||
      r.roleApplied.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || r.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (
    id: number,
    newStatus: "Approved" | "Rejected"
  ) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        onRefresh();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update application status");
      }
    } catch (err) {
      alert("Error updating application status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete application for ${name}?`)) return;

    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onRefresh();
      } else {
        alert("Failed to delete application");
      }
    } catch (err) {
      alert("Error deleting application");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <XCircle className="w-3.5 h-3.5 text-gray-500" />
            Rejected
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 border-b border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>Team & Volunteer Applications</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {filtered.length} applications
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              Review and approve incoming volunteer sign-ups and assign roles.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search applicants by name, role, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Application Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved Volunteers</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="py-3 px-4">Applicant Name</th>
              <th className="py-3 px-4">Contact Phone</th>
              <th className="py-3 px-4">Role Applied</th>
              <th className="py-3 px-4">Applied Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  Loading applications...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-gray-700">
                      No applications found
                    </p>
                    <p className="text-xs text-gray-400">
                      Volunteer registrations submitted via the portal will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-indigo-50/20 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {r.fullName}
                  </td>

                  <td className="py-3.5 px-4">
                    <a
                      href={`tel:${r.phoneNumber}`}
                      className="inline-flex items-center gap-1.5 text-gray-700 hover:text-indigo-600 font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{r.phoneNumber}</span>
                    </a>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {r.roleApplied}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-3.5 px-4">{getStatusBadge(r.status)}</td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {actionLoadingId === r.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        <>
                          {r.status !== "Approved" && (
                            <button
                              onClick={() =>
                                handleStatusChange(r.id, "Approved")
                              }
                              title="Approve volunteer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] transition-colors"
                            >
                              Approve
                            </button>
                          )}

                          {r.status !== "Rejected" && (
                            <button
                              onClick={() =>
                                handleStatusChange(r.id, "Rejected")
                              }
                              title="Reject application"
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition-colors"
                            >
                              Reject
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(r.id, r.fullName)}
                            title="Delete application"
                            className="p-1 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
