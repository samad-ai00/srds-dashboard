"use client";

import { useState } from "react";
import { ShieldAlert, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { BLOOD_GROUPS, TRANSFUSION_STATUSES } from "@/lib/validations";

interface Props {
  onSuccess?: () => void;
}

export default function FighterRegistrationForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState({
    fighterId: "",
    fullName: "",
    dateOfBirth: "",
    gender: "Male",
    bloodGroup: "O+",
    hospital: "",
    assignedNgo: "SRDS Main Chapter",
    transfusionStatus: "Stable",
    lastTransfusion: "",
    nextDue: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/fighters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details?.[0]?.message || "Failed to register fighter");
      }

      setStatusMessage({
        type: "success",
        text: `Fighter "${result.data?.fullName}" (ID: ${result.data?.fighterId}) registered successfully! Transfusion monitoring is now active.`,
      });

      setFormData({
        fighterId: "",
        fullName: "",
        dateOfBirth: "",
        gender: "Male",
        bloodGroup: "O+",
        hospital: "",
        assignedNgo: "SRDS Main Chapter",
        transfusionStatus: "Stable",
        lastTransfusion: "",
        nextDue: "",
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in duration-200 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fighter ID / Card No. <span className="text-xs text-gray-400 font-normal">(Auto-generated if left blank)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. SRDS-F-1025"
            value={formData.fighterId}
            onChange={(e) =>
              setFormData({ ...formData, fighterId: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm uppercase"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fighter (Patient) Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Ayaan Ahmed"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Blood Group <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.bloodGroup}
            onChange={(e) =>
              setFormData({ ...formData, bloodGroup: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm font-medium"
          >
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Hospital / Medical Center
          </label>
          <input
            type="text"
            placeholder="e.g. NICH / Civil Hospital Blood Center"
            value={formData.hospital}
            onChange={(e) =>
              setFormData({ ...formData, hospital: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Assigned NGO / Care Unit
          </label>
          <input
            type="text"
            placeholder="e.g. SRDS Main Chapter"
            value={formData.assignedNgo}
            onChange={(e) =>
              setFormData({ ...formData, assignedNgo: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
          Transfusion Cycle & Clinical Status
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Current Status
            </label>
            <select
              value={formData.transfusionStatus}
              onChange={(e) =>
                setFormData({ ...formData, transfusionStatus: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm font-semibold"
            >
              {TRANSFUSION_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Last Transfusion
            </label>
            <input
              type="date"
              value={formData.lastTransfusion}
              onChange={(e) =>
                setFormData({ ...formData, lastTransfusion: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Next Due Date
            </label>
            <input
              type="date"
              value={formData.nextDue}
              onChange={(e) =>
                setFormData({ ...formData, nextDue: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-sm shadow-md shadow-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Enrolling Fighter...</span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-5 h-5" />
            <span>Register Blood Disorder Fighter</span>
          </>
        )}
      </button>
    </form>
  );
}
