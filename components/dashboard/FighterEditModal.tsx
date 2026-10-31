"use client";

import { useState } from "react";
import { X, CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react";
import { TRANSFUSION_STATUSES } from "@/lib/validations";

interface Fighter {
  id: number;
  fighterId: string;
  fullName: string;
  bloodGroup: string | null;
  hospital: string | null;
  assignedNgo: string | null;
  transfusionStatus: string | null;
  lastTransfusion: string | null;
  nextDue: string | null;
}

interface Props {
  fighter: Fighter;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function FighterEditModal({
  fighter,
  isOpen,
  onClose,
  onUpdated,
}: Props) {
  const [formData, setFormData] = useState({
    transfusionStatus: fighter.transfusionStatus || "Stable",
    lastTransfusion: fighter.lastTransfusion
      ? new Date(fighter.lastTransfusion).toISOString().split("T")[0]
      : "",
    nextDue: fighter.nextDue
      ? new Date(fighter.nextDue).toISOString().split("T")[0]
      : "",
    hospital: fighter.hospital || "",
    assignedNgo: fighter.assignedNgo || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/fighters/${fighter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update fighter");
      }

      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              Update Transfusion Schedule
            </h3>
            <p className="text-xs text-gray-500">
              {fighter.fullName} • <span className="font-semibold text-rose-600">{fighter.fighterId}</span> ({fighter.bloodGroup || "N/A"})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Transfusion Status
            </label>
            <select
              value={formData.transfusionStatus}
              onChange={(e) =>
                setFormData({ ...formData, transfusionStatus: e.target.value })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {TRANSFUSION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Last Transfusion Date
              </label>
              <input
                type="date"
                value={formData.lastTransfusion}
                onChange={(e) =>
                  setFormData({ ...formData, lastTransfusion: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Next Due Date
              </label>
              <input
                type="date"
                value={formData.nextDue}
                onChange={(e) =>
                  setFormData({ ...formData, nextDue: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Hospital / Medical Facility
            </label>
            <input
              type="text"
              value={formData.hospital}
              onChange={(e) =>
                setFormData({ ...formData, hospital: e.target.value })
              }
              placeholder="e.g. NICH or Civil Hospital"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Assigned NGO / Care Unit
            </label>
            <input
              type="text"
              value={formData.assignedNgo}
              onChange={(e) =>
                setFormData({ ...formData, assignedNgo: e.target.value })
              }
              placeholder="e.g. SRDS Main Chapter"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Updates</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
