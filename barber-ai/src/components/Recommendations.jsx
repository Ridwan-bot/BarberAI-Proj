// src/components/Recommendations.jsx
import React from "react";
import { Star, Sparkles, Scissors, Clock, Bookmark } from "lucide-react";
import { getStyleRecommendations } from "../ai/rules";

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

function ConfidenceBadge({ score }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 90 ? "bg-emerald-100 text-emerald-700" :
    pct >= 80 ? "bg-amber-100 text-amber-700" :
                "bg-slate-100 text-slate-700";
  return (
    <div className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>
      <Star className="h-3.5 w-3.5" />
      {pct}%
    </div>
  );
}

function StyleCard({ s, onBook }) {
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[16/8] w-full overflow-hidden">
        <img
          src={s.image}
          alt={s.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <ConfidenceBadge score={s.score} />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{s.name}</h3>
            <p className="mt-1 text-slate-600">
              A great match for your face shape and recent bookings.
            </p>
          </div>

          <button
            onClick={() => setSaved((v) => !v)}
            className={`ml-3 rounded-full p-2 transition ${
              saved ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            title={saved ? "Saved" : "Save"}
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          <div className="inline-flex items-center gap-2">
            <Scissors className="h-4 w-4 text-amber-600" />
            <span>Service: <span className="font-medium">{s.service}</span></span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span>Maintenance: <span className="font-medium">{s.maintenance}</span></span>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-medium text-slate-500">Suitable face shapes:</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {s.faceShapes.map((fs) => (
              <Chip key={fs}>{fs}</Chip>
            ))}
          </div>
        </div>

        <button
          onClick={() => onBook?.(s)}
          className="mt-5 w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-900 hover:brightness-95"
        >
          Book This Style
        </button>
      </div>
    </div>
  );
}

export default function Recommendations({
  profile = { faceShape: "Oval" },
  history = [],
  limit = 4,
  onBook,
}) {
  const recs = React.useMemo(
    () => getStyleRecommendations(profile, history).slice(0, limit),
    [profile, history, limit]
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-600" />
        <h2 className="text-lg font-semibold">Personalized for You</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {recs.map((s) => (
          <StyleCard key={s.id} s={s} onBook={onBook} />
        ))}
      </div>
    </div>
  );
}
