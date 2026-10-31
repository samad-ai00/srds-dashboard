"use client";

import { useState } from "react";
import { Droplet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/validations";

interface Props {
  onSuccess?: () => void;
}

export default function DonorRegistrationForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState({
    donorName: "",
    contactNumber: "",
    bloodGroup: "O+",
    districtCovered: "",
    donationDate: "",
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
      const response = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details?.[0]?.message || "Failed to register donor");
      }

      setStatusMessage({
        type: "success",
        text: "Thank you for registering as a blood donor! You are now part of SRDS's life-saving network.",
      });

      setFormData({
        donorName: "",
        contactNumber: "",
        bloodGroup: "O+",
        districtCovered: "",
        donationDate: "",
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
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Rashid Mahmood"
          value={formData.donorName}
          onChange={(e) =>
            setFormData({ ...formData, donorName: e.target.value })
          }
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Contact Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. +92 300 1234567"
            value={formData.contactNumber}
            onChange={(e) =>
              setFormData({ ...formData, contactNumber: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
          />
        </div>

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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            District / City Covered <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Karachi Central / Hyderabad"
            value={formData.districtCovered}
            onChange={(e) =>
              setFormData({ ...formData, districtCovered: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Last Blood Donation Date <span className="text-xs text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="date"
            value={formData.donationDate}
            onChange={(e) =>
              setFormData({ ...formData, donationDate: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
          />
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
            <span>Registering Donor...</span>
          </>
        ) : (
          <>
            <Droplet className="w-5 h-5 fill-white" />
            <span>Join as Life Saver Donor</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By registering, you agree to be contacted by SRDS coordinators in case of emergency blood requests matching your group.
      </p>
    </form>
  );
}
