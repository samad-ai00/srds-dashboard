"use client";

import { useState } from "react";
import { Users, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { TEAM_ROLES } from "@/lib/validations";

interface Props {
  onSuccess?: () => void;
}

export default function TeamRegistrationForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    roleApplied: TEAM_ROLES[0] as string,
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
      const response = await fetch("/api/register-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details?.[0]?.message || "Failed to submit application");
      }

      setStatusMessage({
        type: "success",
        text: result.message || "Volunteer application submitted successfully! Our SRDS team will contact you shortly.",
      });

      setFormData({
        fullName: "",
        phoneNumber: "",
        roleApplied: TEAM_ROLES[0],
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
          placeholder="e.g. Sumaira Iqbal"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Phone Number / WhatsApp <span className="text-rose-500">*</span>
        </label>
        <input
          type="tel"
          required
          placeholder="e.g. +92 331 1122334"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Role Applied For <span className="text-rose-500">*</span>
        </label>
        <select
          value={formData.roleApplied}
          onChange={(e) =>
            setFormData({ ...formData, roleApplied: e.target.value })
          }
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm font-medium"
        >
          {TEAM_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1.5">
          Select how you would like to contribute: organizing blood camps, coordinating donors, or supporting hospital visits.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-sm shadow-md shadow-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Submitting Application...</span>
          </>
        ) : (
          <>
            <Users className="w-5 h-5" />
            <span>Submit Volunteer Application</span>
          </>
        )}
      </button>
    </form>
  );
}
