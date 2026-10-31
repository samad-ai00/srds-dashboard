"use client";

import { useEffect, useState } from "react";
import {
  Truck,
  Plus,
  Filter,
  Search,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function DispatchesPage() {
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Create Modal
  const [createModal, setCreateModal] = useState({
    open: false,
    fighterId: "",
    fighterName: "",
    donorName: "",
    donorPhone: "",
    bloodGroup: "O+",
    hospital: "",
    urgency: "Immediate",
    status: "Dispatched",
    notes: "",
    submitting: false,
  });

  const fetchDispatches = async () => {
    setLoading(true);
    try {
      const url = `/api/dispatches?status=${statusFilter}&urgency=${urgencyFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setDispatches(json.data);
      }
    } catch (err) {
      console.error("Error fetching dispatches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, [statusFilter, urgencyFilter]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/dispatches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDispatches();
      }
    } catch (err) {
      alert("Error updating dispatch status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this dispatch record?")) return;
    try {
      const res = await fetch(`/api/dispatches/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchDispatches();
      }
    } catch (err) {
      alert("Error deleting dispatch");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateModal((prev) => ({ ...prev, submitting: true }));

    try {
      const res = await fetch("/api/dispatches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fighterId: createModal.fighterId || "SRDS-MANUAL",
          fighterName: createModal.fighterName,
          donorName: createModal.donorName,
          donorPhone: createModal.donorPhone,
          bloodGroup: createModal.bloodGroup,
          hospital: createModal.hospital,
          urgency: createModal.urgency,
          status: createModal.status,
          notes: createModal.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreateModal({
          open: false,
          fighterId: "",
          fighterName: "",
          donorName: "",
          donorPhone: "",
          bloodGroup: "O+",
          hospital: "",
          urgency: "Immediate",
          status: "Dispatched",
          notes: "",
          submitting: false,
        });
        fetchDispatches();
      } else {
        alert(data.error || "Failed to create dispatch");
        setCreateModal((prev) => ({ ...prev, submitting: false }));
      }
    } catch (err) {
      alert("Network error while creating dispatch");
      setCreateModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const filteredDispatches = dispatches.filter((d) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      d.fighterName.toLowerCase().includes(term) ||
      d.donorName.toLowerCase().includes(term) ||
      d.hospital.toLowerCase().includes(term) ||
      d.bloodGroup.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 mb-1">
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            <span>Field Logistics & Ambulance Liaison</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Donor Dispatches Management
          </h1>
          <p className="text-xs text-gray-500">
            Track real-time donor dispatches to clinical transfusion centers and hospitals.
          </p>
        </div>

        <button
          onClick={() => setCreateModal((prev) => ({ ...prev, open: true }))}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold shadow-sm shadow-amber-200 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Manual Dispatch</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by fighter, donor, hospital, blood..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700"
            >
              <option value="all">All Statuses</option>
              <option value="Dispatched">Dispatched</option>
              <option value="En Route">En Route</option>
              <option value="Blood Collected">Blood Collected</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700"
            >
              <option value="all">All Urgencies</option>
              <option value="Immediate">Immediate</option>
              <option value="Within 24h">Within 24 Hours</option>
              <option value="Routine">Routine</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dispatches List / Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading dispatches...</p>
        </div>
      ) : filteredDispatches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-3">
          <Truck className="w-10 h-10 text-gray-400 mx-auto" />
          <h4 className="font-bold text-gray-800 text-sm">No dispatches found</h4>
          <p className="text-xs text-gray-500">
            Dispatch donors from the Patient Matching console or log an emergency dispatch manually.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDispatches.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">
                        {d.donorName}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-bold text-rose-600 text-sm">
                        {d.fighterName}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Patient ID: <span className="font-mono">{d.fighterId}</span>
                    </p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 font-black text-xs border border-rose-100">
                    {d.bloodGroup}
                  </span>
                </div>

                {/* Details Bar */}
                <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span>{d.hospital}</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.urgency === "Immediate"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {d.urgency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                    <span className="text-gray-500 text-[11px]">Donor Phone:</span>
                    <a
                      href={`tel:${d.donorPhone}`}
                      className="font-mono font-bold text-gray-800 hover:text-amber-600 flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{d.donorPhone}</span>
                    </a>
                  </div>

                  {d.notes && (
                    <p className="text-[11px] text-gray-500 italic pt-1">
                      &quot;{d.notes}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom: Status Switcher & Delete */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-500">Status:</span>
                  <select
                    value={d.status}
                    onChange={(e) => handleUpdateStatus(d.id, e.target.value)}
                    className="py-1 px-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-800 bg-white"
                  >
                    <option value="Dispatched">Dispatched</option>
                    <option value="En Route">En Route</option>
                    <option value="Blood Collected">Blood Collected</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDelete(d.id)}
                  title="Delete record"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Manual Dispatch Modal */}
      {createModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Log Emergency Donor Dispatch
                </h3>
                <p className="text-xs text-gray-500">
                  Record field dispatch of a blood donor to a destination hospital
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Fighter / Patient Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={createModal.fighterName}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, fighterName: e.target.value })
                    }
                    placeholder="e.g. Ayaan Ahmed"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Fighter ID (Optional):
                  </label>
                  <input
                    type="text"
                    value={createModal.fighterId}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, fighterId: e.target.value })
                    }
                    placeholder="SRDS-F-1001"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Donor Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={createModal.donorName}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, donorName: e.target.value })
                    }
                    placeholder="e.g. Rashid Mahmood"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Donor Phone:
                  </label>
                  <input
                    type="text"
                    required
                    value={createModal.donorPhone}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, donorPhone: e.target.value })
                    }
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Blood Group:
                  </label>
                  <select
                    value={createModal.bloodGroup}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, bloodGroup: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Urgency:
                  </label>
                  <select
                    value={createModal.urgency}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, urgency: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Immediate">Immediate (Emergency)</option>
                    <option value="Within 24h">Within 24 Hours</option>
                    <option value="Routine">Routine Scheduled Cycle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Destination Hospital:
                </label>
                <input
                  type="text"
                  required
                  value={createModal.hospital}
                  onChange={(e) =>
                    setCreateModal({ ...createModal, hospital: e.target.value })
                  }
                  placeholder="e.g. National Institute of Child Health (NICH)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Dispatch Notes:
                </label>
                <textarea
                  rows={2}
                  value={createModal.notes}
                  onChange={(e) =>
                    setCreateModal({ ...createModal, notes: e.target.value })
                  }
                  placeholder="Instructions or ambulance coordination notes..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    setCreateModal((prev) => ({ ...prev, open: false }))
                  }
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createModal.submitting}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-200 transition-all disabled:opacity-50"
                >
                  {createModal.submitting ? "Logging..." : "Create Dispatch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

