"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  HeartPulse,
  Droplet,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Phone,
  MessageSquare,
  Truck,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";

function MatchingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFighterId = searchParams.get("fighterId") || "";

  const [fightersList, setFightersList] = useState<any[]>([]);
  const [selectedFighterId, setSelectedFighterId] = useState<string>(queryFighterId);
  const [matchingData, setMatchingData] = useState<any>(null);
  const [districtFilter, setDistrictFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [fightersLoading, setFightersLoading] = useState(true);

  // Dispatch Modal State
  const [dispatchModal, setDispatchModal] = useState<{
    open: boolean;
    donor: any | null;
    fighter: any | null;
    hospital: string;
    urgency: "Immediate" | "Within 24h" | "Routine";
    notes: string;
    submitting: boolean;
  }>({
    open: false,
    donor: null,
    fighter: null,
    hospital: "",
    urgency: "Immediate",
    notes: "",
    submitting: false,
  });

  // Fetch list of fighters for selector
  useEffect(() => {
    async function loadFighters() {
      setFightersLoading(true);
      try {
        const res = await fetch("/api/fighters");
        const json = await res.json();
        if (json.success && json.data) {
          setFightersList(json.data);
          // If no query param and fighters exist, pick the first one that is Critical or Due, or first fighter
          if (!queryFighterId && json.data.length > 0) {
            const urgent = json.data.find(
              (f: any) =>
                f.transfusionStatus === "Critical" ||
                f.transfusionStatus === "Transfusion Due"
            );
            setSelectedFighterId(urgent ? urgent.fighterId : json.data[0].fighterId);
          }
        }
      } catch (err) {
        console.error("Error loading fighters list:", err);
      } finally {
        setFightersLoading(false);
      }
    }
    loadFighters();
  }, [queryFighterId]);

  // Fetch matches whenever selectedFighterId or districtFilter changes
  useEffect(() => {
    if (!selectedFighterId) return;

    async function loadMatches() {
      setLoading(true);
      try {
        const url = `/api/matching?fighterId=${encodeURIComponent(
          selectedFighterId
        )}${districtFilter !== "all" ? `&district=${encodeURIComponent(districtFilter)}` : ""}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.success) {
          setMatchingData(json.data);
        } else {
          setMatchingData(null);
        }
      } catch (err) {
        console.error("Error matching donors:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [selectedFighterId, districtFilter]);

  const handleOpenDispatch = (donor: any) => {
    if (!matchingData?.fighter) return;
    setDispatchModal({
      open: true,
      donor,
      fighter: matchingData.fighter,
      hospital: matchingData.fighter.hospital || "Civil Hospital / NICH",
      urgency:
        matchingData.fighter.transfusionStatus === "Critical"
          ? "Immediate"
          : "Within 24h",
      notes: `Matched via SRDS Blood Algorithm (${donor.bloodGroup} for ${matchingData.fighter.fullName} - ${matchingData.fighter.bloodGroup})`,
      submitting: false,
    });
  };

  const handleConfirmDispatch = async () => {
    if (!dispatchModal.donor || !dispatchModal.fighter) return;
    setDispatchModal((prev) => ({ ...prev, submitting: true }));

    try {
      const res = await fetch("/api/dispatches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fighterId: dispatchModal.fighter.fighterId,
          fighterName: dispatchModal.fighter.fullName,
          donorId: dispatchModal.donor.id,
          donorName: dispatchModal.donor.donorName,
          donorPhone: dispatchModal.donor.contactNumber,
          bloodGroup: dispatchModal.donor.bloodGroup,
          hospital: dispatchModal.hospital,
          urgency: dispatchModal.urgency,
          status: "Dispatched",
          notes: dispatchModal.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDispatchModal((prev) => ({ ...prev, open: false, submitting: false }));
        router.push("/dashboard/dispatches");
      } else {
        alert(data.error || "Failed to create dispatch");
        setDispatchModal((prev) => ({ ...prev, submitting: false }));
      }
    } catch (err) {
      alert("Error creating dispatch record");
      setDispatchModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const currentFighter = matchingData?.fighter;
  const compatibleGroups = matchingData?.compatibleGroups || [];
  const matchedDonors = matchingData?.matchedDonors || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 mb-1">
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
            <span>Clinical Blood Compatibility Engine</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Patient-Donor Matching & Dispatch
          </h1>
          <p className="text-xs text-gray-500">
            Automatically determine ABO/Rh compatibility, rest cycle eligibility, and dispatch matched donors.
          </p>
        </div>
      </div>

      {/* Fighter Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 shrink-0">
            Select Fighter / Patient:
          </label>
          <div className="relative flex-1 max-w-md">
            <select
              value={selectedFighterId}
              onChange={(e) => setSelectedFighterId(e.target.value)}
              disabled={fightersLoading}
              className="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-300 bg-gray-50 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {fightersList.map((f) => (
                <option key={f.fighterId} value={f.fighterId}>
                  {f.fullName} ({f.bloodGroup}) — {f.fighterId} [{f.transfusionStatus}]
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">District Filter:</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="pl-2 pr-6 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700"
          >
            <option value="all">All Districts</option>
            <option value="Central">Karachi Central</option>
            <option value="South">Karachi South</option>
            <option value="East">Karachi East</option>
            <option value="West">Karachi West</option>
            <option value="Korangi">Korangi</option>
            <option value="Malir">Malir</option>
          </select>
        </div>
      </div>

      {/* Patient Profile & Compatibility Matrix Card */}
      {currentFighter && (
        <div className="bg-gradient-to-br from-rose-900 via-red-950 to-slate-950 text-white rounded-3xl p-6 shadow-lg border border-rose-900/50 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Column 1: Patient Identity */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                Patient Case Summary
              </span>
              <h2 className="text-2xl font-black">{currentFighter.fullName}</h2>
              <div className="flex items-center gap-2 text-xs text-rose-200">
                <span className="font-mono bg-rose-800/60 px-2 py-0.5 rounded">
                  {currentFighter.fighterId}
                </span>
                <span>•</span>
                <span>{currentFighter.gender || "Patient"}</span>
                {currentFighter.hospital && (
                  <>
                    <span>•</span>
                    <span className="truncate">{currentFighter.hospital}</span>
                  </>
                )}
              </div>
            </div>

            {/* Column 2: Blood Group & Status */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
                {currentFighter.bloodGroup}
              </div>
              <div>
                <p className="text-xs text-rose-200 font-semibold">Recipient Group</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      currentFighter.transfusionStatus === "Critical"
                        ? "bg-red-400 animate-ping"
                        : currentFighter.transfusionStatus === "Transfusion Due"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <span className="text-xs font-bold">
                    {currentFighter.transfusionStatus}
                  </span>
                </div>
                {currentFighter.nextDue && (
                  <p className="text-[11px] text-rose-300 mt-0.5">
                    Due: {new Date(currentFighter.nextDue).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Column 3: Compatible Donor Groups */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs flex flex-col justify-between">
              <div>
                <p className="text-xs text-rose-200 font-semibold mb-2">
                  Acceptable Donor Blood Types:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {compatibleGroups.map((group: string) => (
                    <span
                      key={group}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black shadow-xs ${
                        group === currentFighter.bloodGroup
                          ? "bg-rose-500 text-white ring-2 ring-white/50"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-rose-300 mt-2 flex items-center gap-1">
                <Info className="w-3 h-3 shrink-0" />
                <span>
                  {currentFighter.bloodGroup === "AB+"
                    ? "Universal Recipient (can receive all blood types)"
                    : currentFighter.bloodGroup === "O-"
                    ? "Universal Donor (can only receive O- blood)"
                    : `Can receive identical (${currentFighter.bloodGroup}) or compatible antigens`}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Matched Donors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              Matched Compatible Donors
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
              {matchedDonors.length} Available
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Sorted by donation rest eligibility (≥90 days recommended)
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500">Running clinical compatibility algorithms...</p>
          </div>
        ) : matchedDonors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h4 className="font-bold text-gray-800 text-base">
              No donors currently matched with blood groups {compatibleGroups.join(", ")}
            </h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Try changing the district filter, or register a new voluntary donor in this blood category.
            </p>
            <button
              onClick={() => router.push("/dashboard/donors")}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
            >
              Go to Donors Directory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedDonors.map((donor: any) => (
              <div
                key={donor.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  donor.isEligible
                    ? "border-emerald-200/80 hover:shadow-md hover:border-emerald-300"
                    : "border-gray-200 opacity-80"
                }`}
              >
                <div>
                  {/* Top: Name & Blood Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {donor.donorName}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {donor.districtCovered || "Karachi"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 font-black text-xs border border-rose-100 flex items-center gap-1">
                        <Droplet className="w-3 h-3 fill-rose-600" />
                        {donor.bloodGroup}
                      </span>
                      {donor.isExactGroup ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                          Exact Match
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                          Compatible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Eligibility Status */}
                  <div className="mt-4 p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-[11px]">Donation Rest:</span>
                      {donor.isEligible ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Eligible to Donate
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-[11px]">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Resting Period ({donor.daysSinceDonation || 0}d / 90d)
                        </span>
                      )}
                    </div>
                    {donor.donationDate && (
                      <p className="text-[10px] text-gray-400">
                        Last donated: {new Date(donor.donationDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions: Call, WhatsApp, Dispatch */}
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${donor.contactNumber}`}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>Call</span>
                    </a>

                    <a
                      href={`https://wa.me/${donor.contactNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Assalam-o-Alaikum ${donor.donorName}, SRDS urgently needs your blood group (${donor.bloodGroup}) for fighter ${currentFighter.fullName} at ${currentFighter.hospital || "hospital"}. Can you confirm your availability?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <button
                    onClick={() => handleOpenDispatch(donor)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch This Donor</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dispatch Confirmation Modal */}
      {dispatchModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Confirm Emergency Dispatch
                </h3>
                <p className="text-xs text-gray-500">
                  Assign donor to patient transfusion schedule
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Fighter:</span>
                <span className="font-bold text-gray-900">
                  {dispatchModal.fighter?.fullName} ({dispatchModal.fighter?.bloodGroup})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Donor:</span>
                <span className="font-bold text-rose-600">
                  {dispatchModal.donor?.donorName} ({dispatchModal.donor?.bloodGroup})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contact:</span>
                <span className="font-mono text-gray-700">
                  {dispatchModal.donor?.contactNumber}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Destination Hospital / Blood Center:
                </label>
                <input
                  type="text"
                  value={dispatchModal.hospital}
                  onChange={(e) =>
                    setDispatchModal({ ...dispatchModal, hospital: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="e.g. NICH or Civil Hospital"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Urgency:</label>
                <select
                  value={dispatchModal.urgency}
                  onChange={(e) =>
                    setDispatchModal({
                      ...dispatchModal,
                      urgency: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="Immediate">Immediate (Emergency / Critical)</option>
                  <option value="Within 24h">Within 24 Hours</option>
                  <option value="Routine">Routine Scheduled Cycle</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Operational Dispatch Notes:
                </label>
                <textarea
                  rows={2}
                  value={dispatchModal.notes}
                  onChange={(e) =>
                    setDispatchModal({ ...dispatchModal, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="Additional coordination notes..."
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() =>
                  setDispatchModal({ ...dispatchModal, open: false })
                }
                disabled={dispatchModal.submitting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDispatch}
                disabled={dispatchModal.submitting || !dispatchModal.hospital}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all disabled:opacity-50"
              >
                {dispatchModal.submitting ? "Logging Dispatch..." : "Confirm Dispatch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PatientMatchingPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading Clinical Matching Console...</p>
        </div>
      }
    >
      <MatchingContent />
    </Suspense>
  );
}

