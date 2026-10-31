import Link from "next/link";
import {
  Droplet,
  Heart,
  Users,
  ShieldAlert,
  CalendarCheck,
  Hospital,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Award,
} from "lucide-react";
import RegistrationTabs from "@/components/RegistrationTabs";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-100/60 via-red-50/30 to-transparent pointer-events-none -z-10 blur-2xl" />

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-rose-100/80 text-rose-800 border border-rose-200/60 shadow-sm">
            <Droplet className="w-4 h-4 fill-rose-600 text-rose-600 animate-pulse" />
            <span>Sariroon Red Drop Society (SRDS) • Pakistan</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
            Every Drop Holds A{" "}
            <span className="bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
              Fighter’s Life
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            SRDS is dedicated to supporting blood disorder patients—our brave
            fighters suffering from Thalassemia, Hemophilia, and Aplastic
            Anemia. Connect with ready donors, join as volunteers, or register
            patients for ongoing transfusion care.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <a
              href="#registration-section"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-sm shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all flex items-center gap-2 group"
            >
              <span>Get Started & Register</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Feature Cards / Impact Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Droplet className="w-6 h-6 fill-rose-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Safe Blood Supply</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Matching pre-screened voluntary donors with critical patient transfusion needs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Cycle Tracking</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Monitoring last transfusion dates and timely automated reminders for next due dates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Hospital className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Hospital Liaisons</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Coordinating with NICH, Civil Hospital, JPMC, and specialized thalassemia centers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Volunteer Taskforce</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Mobilizing dedicated field coordinators, camp organizers, and emergency responders.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Callout Banner */}
      <section className="bg-gradient-to-r from-rose-900 via-red-900 to-rose-950 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-rose-700/80 flex items-center justify-center shrink-0 border border-rose-500/50">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg">
                Emergency Blood Requirement? Need Urgent Transfusion?
              </h4>
              <p className="text-xs sm:text-sm text-rose-200">
                Our emergency dispatch desk is active 24/7 to connect registered donors with hospitals.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+923000000000"
              className="px-5 py-2.5 rounded-xl bg-white text-rose-900 font-extrabold text-sm hover:bg-rose-50 transition-colors shadow-sm"
            >
              Call Hotline: 0300-SRDS-HELP
            </a>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="registration-section" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Registration & Engagement Hub
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Choose your role below to make an immediate impact. Whether donating blood, lending your time, or registering a patient for scheduled care.
          </p>
        </div>

        <RegistrationTabs />
      </section>
    </div>
  );
}
