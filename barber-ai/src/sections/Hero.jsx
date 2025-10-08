import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-mid to-brand-dark" />
      {/* subtle bottom accent line */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />

      <div className="relative container-xl py-24 sm:py-28 lg:py-32 text-center text-white">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">BarberAI</h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-white/80">
          The future of barbering is here. Get AI-powered style recommendations,
          seamless booking, and personalized service all in one platform.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
          <Link to="/book"   className="btn btn-ghost ring-white/30 text-white">Book Now</Link>
        </div>

      </div>
    </section>
  );
}
