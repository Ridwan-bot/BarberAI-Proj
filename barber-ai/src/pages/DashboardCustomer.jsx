// src/pages/DashboardCustomer.jsx
import React from "react";
import {
  CalendarDays,
  Clock,
  Star,
  Scissors,
  UserCircle2,
  ChevronRight,
  X,
} from "lucide-react";

// ---------- demo data (replace with API later)
const DEMO_USER = { firstName: "John", preferredBarber: "Mike Johnson" };

const UPCOMING = [
  {
    id: "apt-1",
    service: "Haircut & Styling",
    barber: "Mike Johnson",
    shop: "Breezy Cutz",
    address: "123 Main St",
    dateISO: "2025-01-25",
    time: "14:00",
    durationMin: 60,
    status: "scheduled",
  },
];

const HISTORY = [
  {
    id: "apt-0",
    service: "Skin Fade",
    barber: "Kofi D.",
    dateISO: "2024-12-18",
    time: "15:00",
    durationMin: 45,
    rating: 5,
  },
  {
    id: "apt--1",
    service: "Beard Trim",
    barber: "Mike Johnson",
    dateISO: "2024-11-10",
    time: "12:30",
    durationMin: 20,
    rating: 4,
  },
];

function fmtDateTime(dateISO, time) {
  const d = new Date(`${dateISO}T${time}:00`);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatCard({ icon: Icon, label, value, right }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100">
            <Icon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="text-slate-500 text-sm">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
          </div>
        </div>
        {right}
      </div>
    </div>
  );
}

function Pill({ children, color = "green" }) {
  const map = {
    green: "bg-emerald-100 text-emerald-700",
    gray: "bg-slate-100 text-slate-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[color]}`}>
      {children}
    </span>
  );
}

function SectionCard({ title, tabs, activeTab, setActiveTab, children, right }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-end justify-between px-5 pt-4">
        <div className="flex items-center gap-6">
          <div className="text-lg font-semibold py-3">{title}</div>
          {!!tabs?.length && (
            <div className="flex gap-2">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    t === activeTab
                      ? "text-slate-900 border-b-2 border-amber-500"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
        {right}
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}

/* ---------- Modals (reschedule / cancel) ---------- */
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

/* ---------- Page ---------- */
export default function DashboardCustomer() {
  const [activeTab, setActiveTab] = React.useState("Overview");
  const [rescheduleId, setRescheduleId] = React.useState(null);
  const [cancelId, setCancelId] = React.useState(null);

  // simple reschedule controls
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("");

  const upcomingCount = UPCOMING.length;
  const totalVisits = HISTORY.length + upcomingCount;
  const avgRating =
    HISTORY.length === 0
      ? "—"
      : (HISTORY.reduce((s, a) => s + (a.rating || 0), 0) / HISTORY.length).toFixed(1);

  return (
    <section className="container-xl py-8">
      <h1 className="text-3xl font-extrabold">Welcome back, {DEMO_USER.firstName}!</h1>
      <p className="mt-1 text-slate-600">
        Manage your appointments and discover new styles.
      </p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Upcoming" value={upcomingCount} />
        <StatCard icon={Scissors} label="Total Visits" value={totalVisits} />
        <StatCard
          icon={Star}
          label="Avg Rating"
          value={avgRating}
          right={<Star className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          icon={UserCircle2}
          label="Preferred Barber"
          value={DEMO_USER.preferredBarber.split(" ")[0] || "—"}
        />
      </div>

      {/* Tabs card */}
      <div className="mt-6">
        <SectionCard
          title="Appointments"
          tabs={["Overview", "AI Recommendations", "History"]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        >
          {activeTab === "Overview" && (
            <div className="space-y-4">
              <div className="text-lg font-semibold">Upcoming Appointments</div>

              {UPCOMING.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-slate-500">
                  You have no upcoming appointments.{" "}
                  <a href="/book" className="text-amber-600 underline">
                    Book your next visit →
                  </a>
                </div>
              ) : (
                UPCOMING.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl border border-slate-200 p-4 shadow-sm bg-white"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-semibold">{a.service}</div>
                        <div className="text-slate-600 text-sm">
                          with {a.barber} at {a.shop}
                        </div>
                        <div className="mt-1 text-slate-600 text-sm inline-flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {fmtDateTime(a.dateISO, a.time)}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {a.durationMin} min
                          </span>
                          <span>•</span>
                          <Pill>{a.status}</Pill>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setRescheduleId(a.id)}
                          className="btn btn-primary"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => setCancelId(a.id)}
                          className="btn btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "AI Recommendations" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
                <div className="font-semibold">Recommended for you</div>
                <ul className="mt-3 list-disc pl-5 text-slate-700">
                  <li>Skin Fade every 4–5 weeks based on your history</li>
                  <li>
                    Add <span className="font-medium">Hot Towel Shave</span> to
                    your next booking (+30m)
                  </li>
                  <li>Best times: Thu 5–7pm or Sat 10–12</li>
                </ul>
                <a href="/book" className="mt-4 inline-flex items-center gap-2 text-amber-600 font-medium">
                  Book now <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
                <div className="font-semibold">Style Inspiration</div>
                <p className="mt-2 text-slate-600">
                  Based on your face shape and ratings, these cuts trend well for
                  you: Low Fade, Textured Crop, Tight Taper.
                </p>
              </div>
            </div>
          )}

          {activeTab === "History" && (
            <div className="space-y-3">
              {HISTORY.map((h) => (
                <div
                  key={h.id}
                  className="rounded-xl border border-slate-200 p-4 bg-white flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{h.service}</div>
                    <div className="text-sm text-slate-600">
                      with {h.barber} — {fmtDateTime(h.dateISO, h.time)} •{" "}
                      {h.durationMin}m
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (h.rating || 0) ? "text-amber-500" : "text-slate-300"
                          }`}
                          fill={i < (h.rating || 0) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <a href="/book" className="btn btn-ghost">Book again</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Reschedule modal */}
      <Modal
        open={!!rescheduleId}
        onClose={() => setRescheduleId(null)}
        title="Reschedule appointment"
        footer={
          <>
            <button onClick={() => setRescheduleId(null)} className="btn btn-ghost">
              Close
            </button>
            <button
              disabled={!newDate || !newTime}
              onClick={() => {
                // TODO: call API; for now just close
                setRescheduleId(null);
                setNewDate(""); setNewTime("");
              }}
              className="btn btn-primary disabled:opacity-50"
            >
              Save changes
            </button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Time</label>
            <input
              type="time"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Cancel modal */}
      <Modal
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        title="Cancel appointment"
        footer={
          <>
            <button onClick={() => setCancelId(null)} className="btn btn-ghost">
              Keep
            </button>
            <button
              onClick={() => {
                // TODO: call API; for now just close
                setCancelId(null);
              }}
              className="btn btn-primary"
            >
              Confirm cancel
            </button>
          </>
        }
      >
        <p className="text-slate-600">
          Are you sure you want to cancel this appointment? You can always rebook
          later.
        </p>
      </Modal>
    </section>
  );
}
