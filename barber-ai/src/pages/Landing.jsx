import { Link } from "react-router-dom";

function Feature({ title, desc, icon }) {
  return (
    <div className="rounded-2xl bg-white/70 dark:bg-white/10 p-6 shadow-sm border">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300">{desc}</p>
    </div>
  );
}

function Testimonial({ name, text, stars = 5, avatar }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow border">
      <div className="flex items-center gap-3 mb-2">
        <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
        <div className="font-semibold">{name}</div>
      </div>
      <div className="text-amber-500 mb-2">
        {"★".repeat(stars)}<span className="text-slate-300">{"★".repeat(5 - stars)}</span>
      </div>
      <p className="text-slate-700">{text}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAV */}
      <header className="sticky top-0 z-20 bg-navy-900/90 backdrop-blur border-b border-white/10 text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✂️</span>
            <span className="font-bold">BarberAI</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#features" className="hover:opacity-80">Features</a>
            <a href="#testimonials" className="hover:opacity-80">Reviews</a>
            <Link to="/login" className="hover:opacity-80">Login</Link>
            <Link
              to="/signup"
              className="ml-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 font-medium"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-b from-navy-900 to-navy-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">BarberAI</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10">
            The future of barbering is here. Get AI-powered style recommendations,
            seamless booking, and personalized service — all in one platform.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="rounded-2xl bg-brand-500 hover:bg-brand-600 px-6 py-3 font-semibold"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="rounded-2xl border border-white/30 px-6 py-3 font-semibold hover:bg-white/10"
            >
              Book Now
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Smart Features for Modern Barbering
        </h2>
        <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">
          Experience the perfect blend of technology and craftsmanship for your next haircut.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          <Feature
            icon="🤖"
            title="AI-Powered Recommendations"
            desc="Personalized hairstyle suggestions based on face shape and preferences."
          />
          <Feature
            icon="📅"
            title="Smart Scheduling"
            desc="Real-time availability, automated reminders, and quick rebooking."
          />
          <Feature
            icon="⏱️"
            title="Live Wait Times"
            desc="See current wait times and estimated service duration before you arrive."
          />
          <Feature
            icon="⭐"
            title="Quality Tracking"
            desc="Rate your experience and track your style history for consistent results."
          />
        </div>
      </section>

      {/* SOCIAL PROOF / STATS */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-extrabold text-brand-600">10k+</div>
            <div className="text-slate-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-brand-600">500+</div>
            <div className="text-slate-600">Professional Barbers</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-brand-600">4.9</div>
            <div className="text-slate-600">Average Rating</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Testimonial
            name="John Doe"
            text="The AI recommendations helped me find the perfect style. Never been happier with my haircut!"
            avatar="https://i.pravatar.cc/100?img=1"
          />
          <Testimonial
            name="Sarah Smith"
            text="Booking is so easy and the barbers always know exactly what I like. Great experience!"
            avatar="https://i.pravatar.cc/100?img=5"
          />
          <Testimonial
            name="Mike Johnson"
            text="As a barber, this helps me provide better service by tracking customer preferences."
            avatar="https://i.pravatar.cc/100?img=12"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-navy-800 to-navy-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready for Your Best Haircut Yet?
          </h3>
          <p className="text-white/80 mb-8">
            Join thousands who’ve discovered the future of barbering.
          </p>
          <Link
            to="/signup"
            className="rounded-2xl bg-brand-500 hover:bg-brand-600 px-6 py-3 font-semibold"
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 flex items-center justify-between">
          <div>© {new Date().getFullYear()} BarberAI</div>
          <div className="flex gap-4">
            <a href="#features" className="hover:underline">Features</a>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
