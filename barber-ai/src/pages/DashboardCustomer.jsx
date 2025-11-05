// src/pages/DashboardCustomer.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "../components/FeedbackModal";
import StarRating from "../components/StarRating";
import FeedbackForm from "../components/FeedbackForm";
import { listFeedbackForUser, submitFeedback } from "../lib/feedback";
import { listHistory } from "../lib/history";
import Recommendations from "../components/Recommendations";
import { bestTimeWindow } from "../ai/rules";
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

// Replaced static history with dynamic load

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
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState("Overview");
  const [rescheduleId, setRescheduleId] = React.useState(null);
  const [cancelId, setCancelId] = React.useState(null);
  const [history, setHistory] = React.useState([]);
  const [feedback, setFeedback] = React.useState([]);
  const [pendingRate, setPendingRate] = React.useState(null); // booking to rate

  // simple reschedule controls
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("");

  const upcomingCount = UPCOMING.length;
  const totalVisits = history.length + upcomingCount;
  const avgRating = history.length
    ? (history.reduce((s, a) => s + (a.rating || 0), 0) / history.length).toFixed(1)
    : "—";

  // Profile & history for AI
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  const userId = authUser.id || authUser.email || "demo-user";
  const legacyProfile = JSON.parse(localStorage.getItem("profile") || "{}") || {};
  const storedProfile = JSON.parse(localStorage.getItem(`profile:${userId}`) || "{}") || {};
  const profile = { faceShape: "Oval", ...legacyProfile, ...storedProfile };

  // derive preferences from feedback (simple rule-based weights)
  const prefWeights = React.useMemo(() => {
    const weights = {};
    feedback.forEach((f) => {
      const s = `${f.service || ""}`.toLowerCase();
      const apply = (k, delta) => {
        weights[k] = (weights[k] || 0) + delta;
      };
      const delta = f.rating >= 4 ? 1 : f.rating <= 2 ? -1 : 0;
      if (/fade/.test(s)) apply("fade", delta);
      if (/taper/.test(s)) apply("taper", delta);
      if (/beard/.test(s)) apply("beard", delta);
      if (/buzz/.test(s)) apply("buzz", delta);
      if (/classic|side/.test(s)) apply("classic", delta);
      if (/crop/.test(s)) apply("crop", delta);
    });
    return weights;
  }, [feedback]);

  const historySorted = [...history].sort((a, b) =>
    (b.dateISO + b.time).localeCompare(a.dateISO + a.time)
  );
  const timeWin = bestTimeWindow(historySorted); // { label, reason }

  // When user clicks a recommended style → prefill service and route to /book
  function handleBookFromRec(style) {
    localStorage.setItem("prefillService", style.service);
    navigate("/book");
  }

  // Load history + feedback + open modal if pending
  React.useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("authUser") || "{}");
    const userId = auth.id || auth.email || "demo-user";
    (async () => {
      const [h, f] = await Promise.all([listHistory(userId), listFeedbackForUser(userId)]);
      let seed = h;
      if (!seed || seed.length === 0) {
        seed = [
          { id: 'his-1', service: 'Skin Fade', duration: 45, barber: 'ayo', barberName: 'Ayo Lawal', shop: 'downtown', dateISO: '2025-01-05', time: '14:00', status: 'completed', rating: 5 },
          { id: 'his-2', service: 'Haircut & Styling', duration: 45, barber: 'maria', barberName: 'Maria S.', shop: 'downtown', dateISO: '2025-01-02', time: '11:30', status: 'completed', rating: 4 },
          { id: 'his-3', service: 'Cut + Beard', duration: 60, barber: 'kofi', barberName: 'Kofi D.', shop: 'midtown', dateISO: '2024-12-20', time: '16:15', status: 'completed' },
          { id: 'his-4', service: 'Haircut & Styling', duration: 45, barber: 'remy', barberName: 'Remy P.', shop: 'eastside', dateISO: '2024-12-05', time: '10:45', status: 'completed' },
          { id: 'his-5', service: 'Skin Fade', duration: 45, barber: 'diego', barberName: 'Diego R.', shop: 'university', dateISO: '2024-11-10', time: '09:30', status: 'completed', rating: 5 },
          { id: 'his-6', service: 'Haircut & Styling', duration: 45, barber: 'malik', barberName: 'Malik T.', shop: 'university', dateISO: '2024-10-18', time: '13:00', status: 'completed' },
        ];
        try { localStorage.setItem(`history:${userId}`, JSON.stringify(seed)); } catch (_) {}
      }
      setHistory(seed);
      setFeedback(f);
      const pendingId = localStorage.getItem(`pendingFeedback:${userId}`);
      if (pendingId) {
        const rec = seed.find((x) => x.id === pendingId) || null;
        if (rec) setPendingRate(rec);
      }
    })();
  }, []);

  const enrichedProfile = { ...profile, prefWeights };

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
                  You have no upcoming appointments.{' '}
                  <button onClick={() => navigate('/book')} className="text-amber-600 underline">
                    Book your next visit →
                  </button>
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
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Recommendations grid */}
              <div className="lg:col-span-2">
                <Recommendations
                  profile={enrichedProfile}
                  history={historySorted}
                  limit={6}
                  onBook={handleBookFromRec}
                />
              </div>

              {/* Side insights card */}
              <div className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
                <div className="font-semibold">Personalized tips</div>
                <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
                  <li>
                    Best times:{" "}
                    <span className="font-medium">{timeWin.label}</span>{" "}
                    <span className="text-slate-500">({timeWin.reason})</span>
                  </li>
                  <li>
                    Face shape: <span className="font-medium">{profile.faceShape}</span>
                  </li>
                  <li>
                    Try a <span className="font-medium">Low Fade</span> with your face shape
                  </li>
                  {Object.keys(prefWeights || {}).length > 0 && (
                    <li>
                      Based on ratings, you favor{' '}
                      <span className="font-medium">
                        {Object.entries(prefWeights)
                          .filter(([,v]) => v > 0)
                          .sort((a,b) => b[1]-a[1])
                          .slice(0,2)
                          .map(([k]) => k)
                          .join(', ') || 'classic'}
                      </span>
                      {' '}styles.
                    </li>
                  )}
                  <li>
                    Not sure of your face shape? Open the AI quiz in the Recommendations tab.
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/book")}
                  className="mt-4 inline-flex items-center gap-2 font-medium text-amber-600"
                >
                  Book now <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "History" && (
            <div className="space-y-3">
              {historySorted.map((h) => {
                const needsForm = !h.rating && (h.status === 'completed' || !h.status);
                return (
                  <div key={h.id} className="space-y-2">
                    <div className="rounded-xl border border-slate-200 p-4 bg-white flex items-center justify-between">
                      <div>
                        <div className="font-medium">{h.service}</div>
                        <div className="text-sm text-slate-600">
                          with {h.barberName || h.barber} — {fmtDateTime(h.dateISO, h.time)} • {h.duration || h.durationMin}m
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {!needsForm ? (
                          <div className="flex items-center gap-2">
                            <StarRating value={h.rating || 0} onChange={() => setPendingRate(h)} size={18} />
                            <button onClick={() => setPendingRate(h)} className="btn btn-ghost">Update</button>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500">Not rated yet</div>
                        )}
                        <button
                          onClick={() => { try { localStorage.setItem('prefillService', h.service); } catch (_) {} navigate('/book'); }}
                          className="btn btn-ghost"
                        >
                          Rebook
                        </button>
                      </div>
                    </div>
                    {needsForm && (
                      <FeedbackForm
                        appointment={{ ...h, customerId: userId }}
                        onSubmitted={(_, r) => {
                          const newH = history.map(x => x.id === h.id ? { ...x, rating: r } : x);
                          setHistory(newH);
                          localStorage.setItem(`history:${userId}`, JSON.stringify(newH));
                        }}
                      />
                    )}
                  </div>
                );
              })}
              <button
                onClick={() => navigate('/book')}
                className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-amber-500 text-slate-900 font-semibold px-4 py-3 shadow-lg hover:brightness-95"
              >
                Rebook a service
              </button>
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
                setNewDate("");
                setNewTime("");
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
          Are you sure you want to cancel this appointment? You can always rebook later.
        </p>
  </Modal>

      {/* Feedback modal */}
      <FeedbackModal
        open={!!pendingRate}
        onClose={() => setPendingRate(null)}
        context={{
          service: pendingRate?.service,
          barberName: pendingRate?.barberName || pendingRate?.barber,
        }}
        onSubmit={async ({ rating, comment }) => {
          try {
            const auth = JSON.parse(localStorage.getItem("authUser") || "{}");
            const userId = auth.id || auth.email || "demo-user";
            const payload = await submitFeedback({
              userId,
              bookingId: pendingRate?.id,
              service: pendingRate?.service,
              barberId: pendingRate?.barber,
              rating,
              comment,
              dateISO: pendingRate?.dateISO,
            });

            // update local history rating
            const newHistory = history.map((x) =>
              x.id === pendingRate?.id ? { ...x, rating } : x
            );
            setHistory(newHistory);
            localStorage.setItem(`history:${userId}`, JSON.stringify(newHistory));

            // refresh feedback list
            const f = await listFeedbackForUser(userId);
            setFeedback(f);

            // clear pending flag
            localStorage.removeItem(`pendingFeedback:${userId}`);
          } catch (_) {}
          setPendingRate(null);
        }}
      />
    </section>
  );
}
