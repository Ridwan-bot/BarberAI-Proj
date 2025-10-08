// src/pages/DashboardBarber.jsx
import React from "react";
import {
  CalendarDays,
  Users2,
  Star,
  DollarSign,
  Clock,
  User,
  CheckCircle2,
  Ban,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

/* ------------------ demo data (replace with API later) ------------------ */
const TODAY = [
  { id: "t1", time: "09:00", customer: "John Doe",   service: "Haircut & Styling", duration: 60 },
  { id: "t2", time: "10:30", customer: "Mike Smith", service: "Beard Trim",        duration: 30 },
  { id: "t3", time: "14:00", customer: "Alex Johnson", service: "Full Service",    duration: 90 },
];

const WEEK = { appts: 28, newCustomers: 5, revenue: 1200 }; // $ demo

/* ------------------ helpers & small UI atoms ------------------ */
const initials = (name="") =>
  name.split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase();

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100">
          <Icon className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <div className="text-slate-500 text-sm">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, right, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="text-lg font-semibold">{title}</div>
        {right}
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}

function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="p-4 border-t flex justify-end gap-3">{footer}</div>
      </div>
    </div>
  );
}

/* ------------------ main page ------------------ */
export default function DashboardBarber() {
  // header stats
  const todaysAppointments = TODAY.length;
  const totalCustomers = 156; // demo
  const rating = 4.9;         // demo
  const monthlyRevenue = 4200;// demo

  // date picker (no back-end yet)
  const [dateISO, setDateISO] = React.useState(
    new Date().toISOString().slice(0,10)
  );

  // actions & modals
  const [walkInOpen, setWalkInOpen] = React.useState(false);
  const [walkInName, setWalkInName] = React.useState("");
  const [walkInService, setWalkInService] = React.useState("");
  const [walkInTime, setWalkInTime] = React.useState("");

  function shiftDay(delta) {
    const d = new Date(dateISO);
    d.setDate(d.getDate() + delta);
    setDateISO(d.toISOString().slice(0,10));
  }

  return (
    <section className="container-xl py-8">
      <h1 className="text-3xl font-extrabold">Welcome back, Mike!</h1>
      <p className="mt-1 text-slate-600">Here’s your schedule and business insights</p>

      {/* KPI row */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Today's Appointments" value={todaysAppointments} />
        <StatCard icon={Users2}      label="Total Customers"       value={totalCustomers} />
        <StatCard icon={Star}        label="Rating"                value={rating} />
        <StatCard icon={DollarSign}  label="Monthly Revenue"       value={`$${monthlyRevenue.toLocaleString()}`} />
      </div>

      {/* Two-column layout */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Left: today's schedule */}
        <Card
          title="Today’s Schedule"
          right={
            <div className="flex items-center gap-2">
              <button
                onClick={() => shiftDay(-1)}
                className="rounded-lg border px-2 py-1 text-slate-600 hover:bg-slate-50"
                aria-label="Previous day"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <input
                type="date"
                value={dateISO}
                onChange={(e) => setDateISO(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={() => shiftDay(1)}
                className="rounded-lg border px-2 py-1 text-slate-600 hover:bg-slate-50"
                aria-label="Next day"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          }
        >
          <div className="grid gap-3">
            {TODAY.map((slot) => (
              <div
                key={slot.id}
                className="rounded-xl border border-slate-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {/* avatar */}
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-700 font-semibold">
                    {initials(slot.customer)}
                  </div>
                  <div>
                    <div className="font-medium">{slot.customer}</div>
                    <div className="text-slate-600 text-sm">{slot.service}</div>
                    <div className="text-slate-500 text-xs inline-flex items-center gap-1 mt-1">
                      <Clock className="h-3.5 w-3.5" /> {slot.duration} min
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-semibold">{slot.time}</div>
                    <div className="text-xs text-slate-500">local time</div>
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
              </div>
            ))}
          </div>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          <Card
            title="Quick Actions"
            right={null}
          >
            <div className="grid gap-3">
              <button onClick={() => setWalkInOpen(true)} className="btn btn-primary inline-flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" /> Add Walk-in
              </button>
              <a href="/book" className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 hover:bg-slate-50">
                <CalendarDays className="h-4 w-4" /> View All Appointments
              </a>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 hover:bg-slate-50">
                <Settings className="h-4 w-4" /> Update Availability
              </button>
            </div>
          </Card>

          <Card title="This Week" right={null}>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Appointments</span>
                <span className="font-semibold">{WEEK.appts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">New Customers</span>
                <span className="font-semibold">{WEEK.newCustomers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Revenue</span>
                <span className="font-semibold">${WEEK.revenue.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Walk-in Modal */}
      <Modal
        open={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        title="Add walk-in"
        footer={
          <>
            <button onClick={() => setWalkInOpen(false)} className="btn btn-ghost">
              Close
            </button>
            <button
              className="btn btn-primary"
              disabled={!walkInName || !walkInService || !walkInTime}
              onClick={() => {
                // TODO: send to API
                setWalkInOpen(false);
                setWalkInName(""); setWalkInService(""); setWalkInTime("");
              }}
            >
              Save
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Customer name</label>
            <input
              value={walkInName}
              onChange={(e) => setWalkInName(e.target.value)}
              placeholder="e.g., Jordan B."
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Service</label>
            <input
              value={walkInService}
              onChange={(e) => setWalkInService(e.target.value)}
              placeholder="e.g., Skin Fade"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                value={dateISO}
                onChange={(e) => setDateISO(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Time</label>
              <input
                type="time"
                value={walkInTime}
                onChange={(e) => setWalkInTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}
