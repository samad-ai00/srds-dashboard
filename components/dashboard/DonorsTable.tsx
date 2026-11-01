"use client";

import { useState } from "react";
import {
  Search,
  Droplet,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/validations";

interface Donor {
  id: number;
  donorName: string;
  contactNumber: string;
  bloodGroup: string | null;
  districtCovered: string | null;
  donationDate: string | null;
  createdAt: string;
}

interface Props {
  donors: Donor[];
  loading: boolean;
  onRefresh: () => void;
  onOpenRegisterModal: () => void;
}

export default function DonorsTable({
  donors,
  loading,
  onRefresh,
  onOpenRegisterModal,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Extract unique districts
  const uniqueDistricts = Array.from(
    new Set(donors.map((d) => d.districtCovered).filter(Boolean))
  ) as string[];

  // Filter donors
  const filteredDonors = donors.filter((d) => {
    const matchesSearch =
      search === "" ||
      d.donorName.toLowerCase().includes(search.toLowerCase()) ||
      d.contactNumber.includes(search) ||
      (d.districtCovered &&
        d.districtCovered.toLowerCase().includes(search.toLowerCase()));

    const matchesBlood =
      selectedBloodGroup === "all" || d.bloodGroup === selectedBloodGroup;

    const matchesDistrict =
      selectedDistrict === "all" || d.districtCovered === selectedDistrict;

    return matchesSearch && matchesBlood && matchesDistrict;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredDonors.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedDonors = filteredDonors.slice(startIndex, startIndex + pageSize);

  const getEligibility = (donationDateStr: string | null) => {
    if (!donationDateStr) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Ready (No recent donation)
        </span>
      );
    }

    const last = new Date(donationDateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays >= 90) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Eligible ({diffDays}d ago)
        </span>
      );
    } else {
      const waitDays = 90 - diffDays;
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          Cooldown (in {waitDays}d)
        </span>
      );
    }
  };

  const cleanPhoneForWhatsApp = (phone: string) => {
    return phone.replace(/[^0-9]/g, "");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 border-b border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>Voluntary Donors Directory</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700">
                {filteredDonors.length} donors
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              Browse voluntary blood donors by blood group, location/district, and eligibility.
            </p>
          </div>

          <button
            onClick={onOpenRegisterModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Donor</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by donor name, phone, or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Blood Group Filter */}
          <div>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            >
              <option value="all">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  Blood Group: {bg}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            >
              <option value="all">All Districts</option>
              {uniqueDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  District: {dist}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Donors Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="py-3 px-4">Donor Name</th>
              <th className="py-3 px-4">Blood Group</th>
              <th className="py-3 px-4">District Covered</th>
              <th className="py-3 px-4">Contact & Direct Dispatch</th>
              <th className="py-3 px-4">Last Donation</th>
              <th className="py-3 px-4">Eligibility Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  Loading donors...
                </td>
              </tr>
            ) : filteredDonors.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-gray-700">No donors found</p>
                    <p className="text-xs text-gray-400">
                      Try adjusting the blood group or district filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedDonors.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-red-50/20 transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">{d.donorName}</div>
                    <div className="text-[11px] text-gray-400">
                      Joined {new Date(d.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-bold border border-red-100">
                      <Droplet className="w-3 h-3 fill-red-600" />
                      {d.bloodGroup || "Unknown"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{d.districtCovered || "General"}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${d.contactNumber}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold transition-colors"
                        title="Direct Call"
                      >
                        <Phone className="w-3 h-3 text-rose-600" />
                        <span>{d.contactNumber}</span>
                      </a>

                      <a
                        href={`https://wa.me/${cleanPhoneForWhatsApp(
                          d.contactNumber
                        )}?text=Assalam-o-Alaikum%20${encodeURIComponent(
                          d.donorName
                        )},%20SRDS%20urgently%20requires%20${encodeURIComponent(
                          d.bloodGroup || "blood"
                        )}%20blood%20donation%20for%20a%20fighter.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        title="Send WhatsApp Request"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-gray-600">
                    {d.donationDate ? (
                      new Date(d.donationDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    ) : (
                      <span className="text-gray-400">Not recorded</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {getEligibility(d.donationDate)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredDonors.length > 0 && (
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <strong className="text-gray-900 font-bold">
                {startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-gray-900 font-bold">
                {Math.min(startIndex + pageSize, filteredDonors.length)}
              </strong>{" "}
              of{" "}
              <strong className="text-gray-900 font-bold">
                {filteredDonors.length}
              </strong>{" "}
              donors
            </span>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1 px-2 rounded-lg bg-white border border-gray-200 text-gray-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            <span className="px-2.5 py-1 font-bold text-gray-900">
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
