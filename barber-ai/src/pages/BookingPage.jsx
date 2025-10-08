import React from "react";
import {
  Calendar,
  Clock,
  Scissors,
  ChevronLeft,
  Search,
  Store,
  Building2,
  MapPin,
} from "lucide-react";

// ⬅️ NEW: bring in the one-shot “generate & save” function
import { writeRecommendationsForUser } from "../ai/rules";

/* ---------- SHOPS ---------- */
const SHOPS = [
  { id: "downtown",   name: "Breezy Cutz",   address: "123 Main St",        icon: Building2 },
  { id: "midtown",    name: "Brazy Cutz",    address: "456 Oak Ave",        icon: Store },
  { id: "eastside",   name: "CrossFades",    address: "618 Church St",      icon: Building2 },
  { id: "university", name: "Dapper Cutz",   address: "419 Ogunmefun Ave",  icon: Store },
];

/* ---------- SERVICES (expanded) ---------- */
const SERVICES = [
  { id: "fade",        name: "Skin Fade",        duration: 45, price: 35, desc: "Clean fade with line-up." },
  { id: "beard",       name: "Beard Trim",       duration: 20, price: 15, desc: "Beard shape + finish." },
  { id: "cut+beard",   name: "Cut + Beard",      duration: 60, price: 45, desc: "Full package." },
  { id: "lineup",      name: "Line Up",          duration: 20, price: 12, desc: "Edges and outline only." },
  { id: "hotshave",    name: "Hot Towel Shave",  duration: 30, price: 25, desc: "Classic straight razor shave." },
  { id: "headshave",   name: "Head Shave",       duration: 35, price: 30, desc: "Clean scalp shave & finish." },
  { id: "kids",        name: "Kids Cut (Under 12)", duration: 30, price: 20, desc: "Gentle, quick, and tidy." },
  { id: "washstyle",   name: "Shampoo & Style",  duration: 25, price: 18, desc: "Wash, blow dry, and style." },
  { id: "design",      name: "Hair Design",      duration: 30, price: 20, desc: "Custom parts & simple designs." },
  { id: "deluxe",      name: "Deluxe Package",   duration: 75, price: 60, desc: "Cut + beard + hot towel + style." },
];

/* ---------- BARBERS (≥2 per shop) ---------- */
const BARBERS = [
  // Downtown
  { id: "ayo",   shopId: "downtown",   name: "Ayo Lawal",  rating: 4.9, specialties: ["Fades", "Line-ups"] },
  { id: "maria", shopId: "downtown",   name: "Maria S.",   rating: 4.8, specialties: ["Scissor cuts", "Beards"] },
  { id: "theo",  shopId: "downtown",   name: "Theo K.",    rating: 4.7, specialties: ["Designs", "Afro"] },

  // Midtown
  { id: "kofi",  shopId: "midtown",    name: "Kofi D.",    rating: 5.0, specialties: ["Afro", "Designs"] },
  { id: "nana",  shopId: "midtown",    name: "Nana B.",    rating: 4.8, specialties: ["Fades", "Hot shaves"] },

  // Eastside
  { id: "remy",  shopId: "eastside",   name: "Remy P.",    rating: 4.9, specialties: ["Tapers", "Beards"] },
  { id: "zara",  shopId: "eastside",   name: "Zara Q.",    rating: 4.8, specialties: ["Scissor cuts", "Kids"] },

  // University
  { id: "diego", shopId: "university", name: "Diego R.",   rating: 4.9, specialties: ["Fades", "Line-ups"] },
  { id: "malik", shopId: "university", name: "Malik T.",   rating: 4.7, specialties: ["Designs", "Beards"] },
];

/* ---------- helpers ---------- */
const fmtMoney = n => `$${Number(n || 0).toFixed(2)}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

/** Generate 30-min slots between 9:00–18:00 considering duration + 10m buffer */
function generateSlots(dateISO, durationMin) {
  const open = 9 * 60, close = 18 * 60, buffer = 10;
  const step = 30;
  const slots = [];
  for (let m = open; m + durationMin + buffer <= close; m += step) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}

/* ---------- Step components ---------- */
function ShopStep({ value, onChange, onNext }) {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return SHOPS;
    return SHOPS.filter(
      (x) =>
        x.name.toLowerCase().includes(s) ||
        (x.address || "").toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div>
      <h2 className="text-2xl font-extrabold">Choose a shop</h2>
      <p className="mt-1 text-slate-600">Pick your preferred location.</p>

      <div className="mt-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search shops (name or address)"
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2 outline-none focus:ring-2 focus:ring-brand-gold"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="text-slate-500">No shops match “{q}”.</div>
        ) : (
          filtered.map((s) => {
            const selected = value?.id === s.id;
            const Icon = s.icon || Store;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange(s)}
                className={`text-left rounded-2xl border p-5 transition ${
                  selected ? "border-brand-gold shadow-soft" : "border-slate-200 hover:shadow"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-1 h-5 w-5 text-brand-gold" />
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="mt-1 text-slate-600 text-sm inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {s.address}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={!value}
          onClick={onNext}
          className="btn btn-primary disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function StepHeader({ step }) {
  const steps = ["Shop", "Service", "Barber", "Time", "Details", "Confirm"];
  return (
    <div className="mb-8">
      <div className="flex justify-center gap-6 text-sm">
        {steps.map((label, i) => {
          const idx = i + 1;
          const active = step === idx;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`h-8 w-8 grid place-items-center rounded-full ${
                  active ? "bg-brand-gold text-slate-900" : "bg-slate-200 text-slate-600"
                }`}
              >
                {idx}
              </div>
              <span className={`font-semibold ${active ? "text-slate-900" : "text-slate-500"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent pointer-events-none" />
    </div>
  );
}

function ServiceStep({ value, onChange, onNext, onBack }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold">Choose a service</h2>
      <p className="mt-1 text-slate-600">Pick what you’d like to book.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => {
          const selected = value?.id === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s)}
              className={`text-left rounded-2xl border p-5 transition ${
                selected ? "border-brand-gold shadow-soft" : "border-slate-200 hover:shadow"
              }`}
            >
              <div className="flex items-center gap-2">
                <Scissors className="h-5 w-5 text-brand-gold" />
                <div className="font-semibold">{s.name}</div>
              </div>
              <div className="mt-2 text-slate-600">{s.desc}</div>
              <div className="mt-3 flex items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {s.duration}m
                </span>
                <span>•</span>
                <span>{fmtMoney(s.price)}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className={`mt-6 flex ${onBack ? "justify-between" : "justify-end"}`}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            ‹ Back
          </button>
        )}
        <button
          type="button"
          disabled={!value}
          onClick={onNext}
          className="btn btn-primary disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function BarberStep({ shop, value, onChange, onBack, onNext }) {
  const [q, setQ] = React.useState("");

  const activeForShop = React.useMemo(() => {
    return BARBERS.filter(
      (b) => b.shopId === shop?.id && (b.status || "active") === "active"
    );
  }, [shop]);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return activeForShop;
    return activeForShop.filter((b) => {
      const hay = [b.name, ...(b.specialties || [])].join(" ").toLowerCase();
      return hay.includes(s);
    });
  }, [q, activeForShop]);

  const anyBarber = { id: "any", name: "Any available barber", rating: "—", specialties: ["Fastest match"] };
  const listToRender = [anyBarber, ...filtered];

  return (
    <div>
      <h2 className="text-2xl font-extrabold">Choose your barber</h2>
      <p className="mt-1 text-slate-600">{shop?.name}</p>

      {/* Search */}
      <div className="mt-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search barbers (name or specialty)"
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2 outline-none focus:ring-2 focus:ring-brand-gold"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="text-slate-500">No barbers match “{q}”.</div>
        ) : (
          listToRender.map((b) => {
            const selected = value?.id === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onChange(b)}
                className={`text-left rounded-2xl border p-5 transition ${
                  selected ? "border-brand-gold shadow-soft" : "border-slate-200 hover:shadow"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-sm text-slate-500">
                    {b.rating !== "—" ? `⭐ ${b.rating}` : ""}
                  </div>
                </div>
                <div className="mt-2 text-slate-600 text-sm">
                  {(b.specialties || []).join(" • ")}
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          ‹ Back
        </button>
        <button
          type="button"
          disabled={!value}
          onClick={onNext}
          className="btn btn-primary disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function TimeStep({ service, valueDate, valueTime, onBack, onNext, onDate, onTime }) {
  const slots = service ? generateSlots(valueDate || todayISO(), service.duration) : [];
  return (
    <div>
      <h2 className="text-2xl font-extrabold">Pick a date & time</h2>
      <p className="mt-1 text-slate-600">Only valid slots are shown.</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-[220px,1fr]">
        <div className="rounded-2xl border border-slate-200 p-4">
          <label className="flex items-center gap-2 font-medium">
            <Calendar className="h-5 w-5 text-brand-gold" /> Date
          </label>
          <input
            type="date"
            min={todayISO()}
            value={valueDate || todayISO()}
            onChange={(e) => onDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="font-medium mb-3">Available times</div>
          {slots.length === 0 ? (
            <div className="text-slate-500">Select a service first.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {slots.map((t) => {
                const selected = valueTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onTime(t)}
                    className={`rounded-xl px-3 py-2 border text-sm ${
                      selected ? "border-brand-gold bg-amber-50 text-slate-900" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          type="button"
          disabled={!valueDate || !valueTime}
          onClick={onNext}
          className="btn btn-primary disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function DetailsPaymentStep({ onBack, onNext, shop, service, barber, dateISO, time }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const valid = name && email && service && barber && dateISO && time;

  return (
    <div>
      <h2 className="text-2xl font-extrabold">Your details</h2>
      <p className="mt-1 text-slate-600">We’ll send confirmation & reminders.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Stephen Cole"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700">Notes (optional)</label>
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any preferences?"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 p-4">
        <div className="font-semibold">Summary</div>
        <div className="mt-2 text-slate-600 text-sm">
          {service?.name} • {service?.duration}m • {fmtMoney(service?.price || 0)}<br />
          Shop: {shop?.name}<br />
          Barber: {barber?.id === "any" ? "Assigned at check-in" : barber?.name}<br />
          When: {dateISO} at {time}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          type="button"
          disabled={!valid}
          onClick={() => onNext({ name, email, notes })}
          className="btn btn-primary disabled:opacity-50"
        >
          Confirm booking
        </button>
      </div>
    </div>
  );
}

function ConfirmStep({ payload }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-extrabold">You’re booked! 🎉</h2>
      <p className="mt-2 text-slate-600">
        We’ve sent a confirmation to <span className="font-semibold">{payload.email}</span>.
      </p>

      <div className="mt-6 mx-auto max-w-md rounded-2xl border border-slate-200 p-5 text-left">
        <div className="font-semibold">Appointment</div>
        <div className="mt-2 text-slate-600 text-sm">
          {payload.service.name} • {payload.service.duration}m • {fmtMoney(payload.service.price)}<br />
          Shop: {payload.shop.name}<br />
          Barber: {payload.barber.id === "any" ? "Assigned at check-in" : payload.barber.name}<br />
          When: {payload.dateISO} at {payload.time}<br />
          Name: {payload.name}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <a href="/" className="btn btn-ghost">Back to home</a>
        <a href="/dashboard/customer" className="btn btn-primary">Go to my appointments</a>
      </div>
    </div>
  );
}

/* ---------- main page ---------- */
export default function BookingPage() {
  const [step, setStep]   = React.useState(1);
  const [shop, setShop]   = React.useState(null);
  const [service, setService] = React.useState(null);
  const [barber, setBarber]   = React.useState(null);
  const [dateISO, setDateISO] = React.useState(todayISO());
  const [time, setTime]       = React.useState("");
  const [details, setDetails] = React.useState(null);

    React.useEffect(() => {
    const s = localStorage.getItem("prefillService");
    if (s) {
        const found = SERVICES.find((x) => x.name === s);
        if (found) setService(found);
        localStorage.removeItem("prefillService");
    }
    }, []);

  // ⬅️ NEW: handle final confirm — generate & store recommendations
  function handleConfirm(d) {
    setDetails(d);

    try {
      const auth = JSON.parse(localStorage.getItem("authUser") || "{}");
      // simple id fallback for demo (works with your current auth mock)
      const userId = auth.id || auth.email || "demo-user";

      // demo profile (faceShape, likes, history) — these keys are optional
      const profile = {
        faceShape: auth.faceShape || "Oval",
        liked: JSON.parse(localStorage.getItem(`liked:${userId}`) || "[]"),
        history: JSON.parse(localStorage.getItem(`history:${userId}`) || "[]"),
      };

      const recentBooking = {
        shop,
        service,
        barber,
        dateISO,
        time,
        name: d.name,
        email: d.email,
      };

      // one call does it all: generate + persist “AI recommendations”
      writeRecommendationsForUser(userId, profile, recentBooking);

      // (optional) push into simple local history for future demos
      const newHistory = [
        ...profile.history,
        {
          dateISO,
          time,
          service: service?.name,
          duration: service?.duration,
          barber: barber?.id,
          shop: shop?.id,
        },
      ];
      localStorage.setItem(`history:${userId}`, JSON.stringify(newHistory));
    } catch (_) {
      // swallow demo storage errors
    }

    setStep(6);
  }

  return (
    <section className="container-xl py-10">
      <StepHeader step={step} />

      {step === 1 && (
        <ShopStep value={shop} onChange={setShop} onNext={() => setStep(2)} />
      )}

      {step === 2 && (
        <ServiceStep
          value={service}
          onChange={setService}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <BarberStep
          shop={shop}
          value={barber}
          onChange={setBarber}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <TimeStep
          service={service}
          valueDate={dateISO}
          valueTime={time}
          onDate={setDateISO}
          onTime={setTime}
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && (
        <DetailsPaymentStep
          shop={shop}
          service={service}
          barber={barber}
          dateISO={dateISO}
          time={time}
          onBack={() => setStep(4)}
          onNext={handleConfirm}
        />
      )}

      {step === 6 && (
        <ConfirmStep payload={{ ...details, shop, service, barber, dateISO, time }} />
      )}
    </section>
  );
}
