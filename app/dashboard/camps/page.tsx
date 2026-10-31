"use client";

import { useEffect, useState } from "react";
import {
  Tent,
  Plus,
  Calendar,
  MapPin,
  Users,
  Droplet,
  Phone,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Filter,
} from "lucide-react";

export default function CampsPage() {
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Create Modal
  const [createModal, setCreateModal] = useState({
    open: false,
    campTitle: "",
    location: "",
    targetCity: "Karachi",
    campDate: "",
    targetBags: 50,
    collectedBags: 0,
    coordinatorName: "",
    contactNumber: "",
    status: "Scheduled",
    submitting: false,
  });

  // Edit / Update Bags Modal
  const [editModal, setEditModal] = useState<{
    open: boolean;
    camp: any | null;
    collectedBags: number;
    status: string;
    submitting: boolean;
  }>({
    open: false,
    camp: null,
    collectedBags: 0,
    status: "Scheduled",
    submitting: false,
  });

  const fetchCamps = async () => {
    setLoading(true);
    try {
      const url = `/api/camps?status=${statusFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setCamps(json.data);
      }
    } catch (err) {
      console.error("Error fetching camps:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, [statusFilter]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateModal((prev) => ({ ...prev, submitting: true }));

    try {
      const res = await fetch("/api/camps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campTitle: createModal.campTitle,
          location: createModal.location,
          targetCity: createModal.targetCity,
          campDate: createModal.campDate,
          targetBags: Number(createModal.targetBags),
          collectedBags: Number(createModal.collectedBags),
          coordinatorName: createModal.coordinatorName,
          contactNumber: createModal.contactNumber,
          status: createModal.status,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreateModal({
          open: false,
          campTitle: "",
          location: "",
          targetCity: "Karachi",
          campDate: "",
          targetBags: 50,
          collectedBags: 0,
          coordinatorName: "",
          contactNumber: "",
          status: "Scheduled",
          submitting: false,
        });
        fetchCamps();
      } else {
        alert(data.error || "Failed to schedule camp");
        setCreateModal((prev) => ({ ...prev, submitting: false }));
      }
    } catch (err) {
      alert("Network error while creating camp schedule");
      setCreateModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.camp) return;
    setEditModal((prev) => ({ ...prev, submitting: true }));

    try {
      const res = await fetch(`/api/camps/${editModal.camp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editModal.status,
          collectedBags: Number(editModal.collectedBags),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditModal({ open: false, camp: null, collectedBags: 0, status: "Scheduled", submitting: false });
        fetchCamps();
      } else {
        alert(data.error || "Failed to update camp");
        setEditModal((prev) => ({ ...prev, submitting: false }));
      }
    } catch (err) {
      alert("Network error updating camp");
      setEditModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this camp schedule?")) return;
    try {
      const res = await fetch(`/api/camps/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchCamps();
    } catch (err) {
      alert("Error deleting camp schedule");
    }
  };

  const totalTarget = camps.reduce((acc, c) => acc + (c.targetBags || 0), 0);
  const totalCollected = camps.reduce((acc, c) => acc + (c.collectedBags || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 mb-1">
            <Tent className="w-3.5 h-3.5 text-emerald-600" />
            <span>Community Blood Drives & Mobilization</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Blood Donation Camps & Drives
          </h1>
          <p className="text-xs text-gray-500">
            Schedule university, corporate, and community blood drives to maintain blood reserves.
          </p>
        </div>

        <button
          onClick={() => setCreateModal((prev) => ({ ...prev, open: true }))}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Blood Drive</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Drives Scheduled
            </p>
            <p className="text-2xl font-black text-gray-900 mt-1">{camps.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Tent className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Target Blood Units
            </p>
            <p className="text-2xl font-black text-gray-900 mt-1">{totalTarget} Bags</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Droplet className="w-5 h-5 fill-rose-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Units Collected
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{totalCollected} Bags</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-700">Filter Camps by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1 px-3 rounded-lg border border-gray-200 text-xs text-gray-700 bg-gray-50"
          >
            <option value="all">All Drives</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Camps Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading camps...</p>
        </div>
      ) : camps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-3">
          <Tent className="w-10 h-10 text-gray-400 mx-auto" />
          <h4 className="font-bold text-gray-800 text-sm">No camps found</h4>
          <p className="text-xs text-gray-500">Schedule a new donation drive to mobilize donors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {camps.map((camp) => {
            const percent = Math.min(
              100,
              Math.round(((camp.collectedBags || 0) / (camp.targetBags || 1)) * 100)
            );
            return (
              <div
                key={camp.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-base leading-snug">
                      {camp.campTitle}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        camp.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : camp.status === "In Progress"
                          ? "bg-blue-100 text-blue-800 animate-pulse"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{new Date(camp.campDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{camp.location}, {camp.targetCity}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>Coordinator: {camp.coordinatorName}</span>
                    </p>
                  </div>

                  {/* Target Bags Progress */}
                  <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-600">Collection Target:</span>
                      <span className="text-emerald-700">
                        {camp.collectedBags} / {camp.targetBags} Bags ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${camp.contactNumber}`}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-emerald-700"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{camp.contactNumber}</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setEditModal({
                          open: true,
                          camp,
                          collectedBags: camp.collectedBags,
                          status: camp.status,
                          submitting: false,
                        })
                      }
                      title="Update bags collected & status"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(camp.id)}
                      title="Delete camp schedule"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Camp Modal */}
      {createModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Tent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Schedule Blood Donation Camp
                </h3>
                <p className="text-xs text-gray-500">
                  Plan a new voluntary drive at a university, college, or community center
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Camp Title:</label>
                <input
                  type="text"
                  required
                  value={createModal.campTitle}
                  onChange={(e) =>
                    setCreateModal({ ...createModal, campTitle: e.target.value })
                  }
                  placeholder="e.g. University of Karachi Blood Drive"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Location / Venue:</label>
                  <input
                    type="text"
                    required
                    value={createModal.location}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, location: e.target.value })
                    }
                    placeholder="e.g. Gymnasium Hall"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target City:</label>
                  <input
                    type="text"
                    required
                    value={createModal.targetCity}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, targetCity: e.target.value })
                    }
                    placeholder="Karachi"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Camp Date:</label>
                  <input
                    type="date"
                    required
                    value={createModal.campDate}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, campDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Bags Goal:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={createModal.targetBags}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, targetBags: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Coordinator Name:</label>
                  <input
                    type="text"
                    required
                    value={createModal.coordinatorName}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, coordinatorName: e.target.value })
                    }
                    placeholder="e.g. Engr. Danish Raza"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contact Phone:</label>
                  <input
                    type="text"
                    required
                    value={createModal.contactNumber}
                    onChange={(e) =>
                      setCreateModal({ ...createModal, contactNumber: e.target.value })
                    }
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
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
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all disabled:opacity-50"
                >
                  {createModal.submitting ? "Scheduling..." : "Schedule Camp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Collected Bags Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-extrabold text-base text-gray-900">
              Update Camp Status & Collection
            </h3>
            <p className="text-xs text-gray-500">{editModal.camp?.campTitle}</p>

            <form onSubmit={handleUpdateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Status:</label>
                <select
                  value={editModal.status}
                  onChange={(e) =>
                    setEditModal({ ...editModal, status: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Blood Bags Collected:
                </label>
                <input
                  type="number"
                  min="0"
                  value={editModal.collectedBags}
                  onChange={(e) =>
                    setEditModal({ ...editModal, collectedBags: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditModal({ open: false, camp: null, collectedBags: 0, status: "Scheduled", submitting: false })
                  }
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editModal.submitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all disabled:opacity-50"
                >
                  {editModal.submitting ? "Updating..." : "Save Progress"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

