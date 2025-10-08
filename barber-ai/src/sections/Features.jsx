import React from "react";
import { Bot, Calendar, CalendarClock, Clock, Pentagon, Scissors, Sparkles, Star, StarsIcon } from "lucide-react";

const items = [
  {
    icon: Bot,
    title: "AI-Powered Recommendations",
    desc: "Personalized hairstyle suggestions based on face shape and preferences.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    desc: "Book appointments with real-time availability and automated reminders.",
  },
  {
    icon: Clock,
    title: "Live Wait Times",
    desc: "See current wait times and estimated service duration before you arrive.",
  },
  {
    icon: Star,
    title: "Quality Tracking",
    desc: "Rate your experience and track your style history for consistent results.",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    desc: "The perfect blend of technology and craftsmanship for your next haircut.",
  },
  {
    icon: Scissors,
    title: "Style History & Gallery",
    desc: "Browse your past cuts and saved looks to make your next visit seamless.",
  }
];

export default function Features() {
  return (
    <section id="features" className="bg-white">
      <div className="container-xl py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center">
          Smart Features for Modern Barbering
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-center text-slate-600">
        Cutting-edge tech… literally | AI that knows your fade better than your barber
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-200 p-6 shadow-soft hover:shadow-lg transition">
              <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-brand-gold" />
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              </div>
              <p className="mt-3 text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />

    </section>
  );
}
