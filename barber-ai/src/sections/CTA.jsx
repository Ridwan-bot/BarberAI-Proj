import React from "react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-mid to-brand-dark" />

      {/* thin gold shimmer line at the very top of this section */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />

      <div className="relative container-xl py-16 sm:py-24 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-extrabold">
          Ready for Your Best Haircut Yet?
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-white/80">
          Join thousands of satisfied customers who’ve discovered the future of barbering.
        </p>

        <div className="mt-8">
          {/* Change link to your route/anchor */}
          <Link to="/signup" className="btn btn-primary">
            Start Your Journey
          </Link>
        </div>
      </div>
    </section>
  );
}
