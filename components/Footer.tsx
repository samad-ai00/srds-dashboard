"use client";

import { usePathname } from "next/navigation";
import { Droplet, Heart, Shield, PhoneCall } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on dashboard and admin login pages
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin/login")) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Sarioon Volunteers (SRDS)
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Sarioon Red Drop Society is committed to saving and transforming the lives of blood disorder
              fighters (Thalassemia, Hemophilia & Leukemia patients). We bridge
              compassionate voluntary blood donors, dedicated volunteers, and
              healthcare facilities across Pakistan.
            </p>
            <div className="flex items-center gap-3 text-xs text-rose-400 font-semibold bg-rose-950/50 border border-rose-900/60 px-3 py-2 rounded-lg max-w-fit">
              <PhoneCall className="w-4 h-4" />
              <span>24/7 Emergency Blood Helpline: +92 300 000SRDS</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/#registration-section" className="hover:text-rose-400 transition-colors">
                  Join Blood Donor Network
                </a>
              </li>
              <li>
                <a href="/#registration-section" className="hover:text-rose-400 transition-colors">
                  Register as Volunteer / Team
                </a>
              </li>
              <li>
                <a href="/#registration-section" className="hover:text-rose-400 transition-colors">
                  Register Blood Fighter Patient
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Core Principles
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                <span>100% Free Blood Transfusion Support</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Screened & Safe Voluntary Donations</span>
              </li>
              <li className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Real-time Patient Transfusion Scheduling</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Sarioon Volunteers (SRDS). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for the Fighters and Donors.
          </p>
        </div>
      </div>
    </footer>
  );
}
