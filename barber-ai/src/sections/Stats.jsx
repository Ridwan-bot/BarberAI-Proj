import React from "react";

const stats = [
  { value: "10k+", label: "Happy Customers" },
  { value: "500+", label: "Professional Barbers" },
  { value: "4.9", label: "Average Rating" },
  { value: "100+", label: "Cities Served" },
];


export default function Stats() {
  return (
    <section id="stats" className="bg-slate-50 scroll-mt-20">
      <div className="container-xl py-14">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-0 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-extrabold tracking-tight text-brand-gold">
                {s.value}
              </div>
              <div className="mt-2 text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
