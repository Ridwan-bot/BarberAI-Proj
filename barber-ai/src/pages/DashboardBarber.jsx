// src/pages/DashboardBarber.jsx
import React from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  User,
  DollarSign,
  Scissors,
  Ban,
  Plus,
} from "lucide-react";

const TODAY = [
  { id: "t1", time: "09:00", customer: "John A.", service: "Skin Fade", duration: 45, status: "booked" },
  { id: "t2", time: "10:00", customer: "Sam B.", service: "Beard Trim", duration: 20, status: "booked" },
  { id: "t3", time: "11:00", customer: "Chloe C.", service: "Cut + Beard", duration: 60, status: "booked" },
  { id: "t4", time: "13:00", customer: "Diego R.", service: "Hot Towel Shave", duration: 30, status: "booked" },
];

function Stat({ icon: Icon, label, value, foot }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100">
          <Icon className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <div className="text-slate-500 text-sm">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
          {foot && <div className="text-slate-500 text-xs mt-0.5">{foot}</div>}
        </div>
      </div>
    </div>
  );
}

export default function DashboardBarber() {
  const completed = 1;
  const revenue = 85; // placeholder

  return (
    <section className="container-xl py-8">
      <h1 className="text-3xl font-extrabold">Good day, Mike!</h1>
      <p className="mt-1 text-slate-600">Here’s your schedule and performance for today.</p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat icon={CalendarDays} label="Bookings Today" value={TODAY.length} />
        <Stat icon={CheckCircle2} label="Completed" value={completed} />
        <Stat icon={DollarSign} label="Revenue" value={`$${revenue}`} />
        <Stat icon={Scissors} label="Utilization" value="72%" foot="(booked / available)" />
      </div>

      {/* Today's schedule */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="text-lg font-semibold">Today</div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">
              <Ban className="h-4 w-4" /> Block time
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">
              <Plus className="h-4 w-4" /> Add walk-in
            </button>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="grid gap-3">
            {TODAY.map((slot) => (
              <div key={slot.id} className="rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="font-semibold w-[72px]">{slot.time}</div>
                  <div>
                    <div className="font-medium">{slot.customer}</div>
                    <div className="text-slate-600 text-sm">{slot.service}</div>
                    <div className="text-slate-500 text-xs inline-flex items-center gap-1 mt-1">
                      <Clock className="h-3.5 w-3.5" /> {slot.duration} min
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">
                    <User className="h-4 w-4" /> Check-in
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">
                    <CheckCircle2 className="h-4 w-4" /> Complete
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">
                    <Ban className="h-4 w-4" /> No-show
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
