"use client";

import { useState } from "react";
import { X, Droplet, ShieldAlert, UserPlus, Users } from "lucide-react";
import FighterRegistrationForm from "../FighterRegistrationForm";
import DonorRegistrationForm from "../DonorRegistrationForm";
import TeamRegistrationForm from "../TeamRegistrationForm";

interface Props {
  isOpen: boolean;
  defaultTab?: "fighter" | "donor" | "team";
  onClose: () => void;
  onAdded: () => void;
}

export default function QuickAddModal({
  isOpen,
  defaultTab = "fighter",
  onClose,
  onAdded,
}: Props) {
  const [tab, setTab] = useState<"fighter" | "donor" | "team">(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setTab("fighter")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === "fighter"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Add Fighter (Patient)
            </button>
            <button
              onClick={() => setTab("donor")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === "donor"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Add Blood Donor
            </button>
            <button
              onClick={() => setTab("team")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === "team"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Add Team Member
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {tab === "fighter" ? (
            <FighterRegistrationForm
              onSuccess={() => {
                onAdded();
                onClose();
              }}
            />
          ) : tab === "donor" ? (
            <DonorRegistrationForm
              onSuccess={() => {
                onAdded();
                onClose();
              }}
            />
          ) : (
            <TeamRegistrationForm
              onSuccess={() => {
                onAdded();
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
