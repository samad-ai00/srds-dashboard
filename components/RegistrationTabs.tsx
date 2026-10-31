"use client";

import { useState } from "react";
import { Droplet, Users, ShieldAlert, Heart } from "lucide-react";
import DonorRegistrationForm from "./DonorRegistrationForm";
import TeamRegistrationForm from "./TeamRegistrationForm";
import FighterRegistrationForm from "./FighterRegistrationForm";

export default function RegistrationTabs() {
  const [activeTab, setActiveTab] = useState<"donor" | "team" | "fighter">("donor");

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Tab Navigation */}
      <div className="grid grid-cols-3 border-b border-gray-100 p-2 bg-gray-50/80 gap-1.5 sm:gap-2">
        <button
          onClick={() => setActiveTab("donor")}
          className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "donor"
              ? "bg-white text-rose-700 shadow-md shadow-gray-200/50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              activeTab === "donor"
                ? "bg-rose-100 text-rose-600"
                : "bg-gray-200/60 text-gray-500"
            }`}
          >
            <Droplet className="w-4 h-4 fill-current" />
          </div>
          <span className="hidden sm:inline">Join as</span>
          <span>Donor</span>
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "team"
              ? "bg-white text-rose-700 shadow-md shadow-gray-200/50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              activeTab === "team"
                ? "bg-rose-100 text-rose-600"
                : "bg-gray-200/60 text-gray-500"
            }`}
          >
            <Users className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">Join</span>
          <span>Volunteer Team</span>
        </button>

        <button
          onClick={() => setActiveTab("fighter")}
          className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "fighter"
              ? "bg-white text-rose-700 shadow-md shadow-gray-200/50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              activeTab === "fighter"
                ? "bg-rose-100 text-rose-600"
                : "bg-gray-200/60 text-gray-500"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">Enroll</span>
          <span>Fighter (Patient)</span>
        </button>
      </div>

      {/* Tab Content Header */}
      <div className="p-6 sm:p-8">
        <div className="mb-6 pb-6 border-b border-gray-100">
          {activeTab === "donor" && (
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 mb-2">
                <Heart className="w-3.5 h-3.5 fill-rose-600" /> Save up to 3 lives per donation
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Blood Donor Registration
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter your details to join our standby blood network. We match you with nearby patients in need of urgent transfusions.
              </p>
            </div>
          )}

          {activeTab === "team" && (
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
                <Users className="w-3.5 h-3.5" /> Community Heroes Network
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Volunteer & Team Membership Form
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Join our dedicated team of field volunteers, medical liaisons, and blood camp organizers to expand our reach.
              </p>
            </div>
          )}

          {activeTab === "fighter" && (
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 mb-2">
                <ShieldAlert className="w-3.5 h-3.5" /> Comprehensive Care & Transfusion Tracking
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Register Blood Disorder Patient (Fighter)
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Register a child or patient with Thalassemia, Hemophilia, or Aplastic Anemia to schedule and track routine transfusions.
              </p>
            </div>
          )}
        </div>

        {/* Tab Forms */}
        {activeTab === "donor" && <DonorRegistrationForm />}
        {activeTab === "team" && <TeamRegistrationForm />}
        {activeTab === "fighter" && <FighterRegistrationForm />}
      </div>
    </div>
  );
}
