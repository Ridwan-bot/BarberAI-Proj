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
import { listAllFeedback } from "../lib/feedback";
import BarberFeedbackPanel from "../components/BarberFeedbackPanel";
import { markAppointmentCompleted } from "../lib/db";

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
  const [avgRating, setAvgRating] = React.useState("—");
  const [topServices, setTopServices] = React.useState([]);
  const completed = 1;
  const revenue = 85; // placeholder

  React.useEffect(() => {
    (async () => {
      const all = await listAllFeedback();
      if (all.length) {
        const myAvg = (all.reduce((s, r) => s + (r.rating || 0), 0) / all.length).toFixed(1);
        setAvgRating(myAvg);
        const counts = all.reduce((acc, r) => {
          acc[r.service] = (acc[r.service] || 0) + 1;
          return acc;
        }, {});
        const sorted = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name, count]) => ({ name, count }));
        setTopServices(sorted);
      }
    })();
  }, []);

  return (
    <section className="container-xl py-8">
      <h1 className="text-3xl font-extrabold">Good day, Mike!</h1>
      <p className="mt-1 text-slate-600">Here’s your schedule and performance for today.</p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat icon={CalendarDays} label="Bookings Today" value={TODAY.length} />
        <Stat icon={CheckCircle2} label="Completed" value={completed} />
        <Stat icon={DollarSign} label="Revenue" value={`$${revenue}`} />
        <Stat icon={Scissors} label="Avg Rating" value={avgRating} foot="from recent feedback" />
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
                  <button
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
                    onClick={() => markAppointmentCompleted(slot.id)}
                  >
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
      {/* Performance insights */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 text-lg font-semibold">Performance</div>
        <div className="px-5 pb-5 grid gap-6 lg:grid-cols-3">
          {/* Most requested services with bars */}
          <div>
            <div className="text-slate-500 text-sm">Most requested services</div>
            <div className="mt-3 space-y-2">
              {(topServices.length ? topServices : [
                { name: "Skin Fade", count: 18 },
                { name: "Beard Trim", count: 12 },
                { name: "Taper + Beard", count: 9 },
              ]).map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="text-slate-500">{s.count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: `${Math.min(100, 10 + s.count * 5)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Repeat customers */}
          <div>
            <div className="text-slate-500 text-sm">Repeat customers</div>
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-3xl font-semibold text-emerald-800">42%</div>
              <div className="text-slate-700 text-sm">of last month’s clients rebooked within 6 weeks</div>
            </div>
            <div className="mt-2 text-xs text-slate-500">Demo metric; improves as more history is captured.</div>
          </div>

          {/* Ratings trend */}
          <div>
            <div className="text-slate-500 text-sm">Ratings trend</div>
            <div className="mt-3 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold">{avgRating}</div>
                <div className="text-xs text-emerald-700 font-medium">+0.2 this week</div>
              </div>
              <div className="mt-3 h-12 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 rounded-lg" />
              <div className="mt-2 text-xs text-slate-500">Based on last 10 reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback panel */}
      <div className="mt-6">
        <BarberFeedbackPanel />
      </div>
    </section>
  );
}
