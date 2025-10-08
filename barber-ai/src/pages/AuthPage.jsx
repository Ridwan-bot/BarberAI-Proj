// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../state/AuthContext";

export default function AuthPage({ mode = "login" }) {
  const [role, setRole] = useState("customer"); // "customer" | "barber"
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const isLogin = mode === "login";
  const title = isLogin ? "Welcome Back" : "Create your account";
  const cta = isLogin ? "Sign In" : "Create Account";
  const switchText = isLogin ? (
    <>Don't have an account? <Link to="/signup" className="text-brand-gold hover:underline">Sign up here</Link></>
  ) : (
    <>Already have an account? <Link to="/login" className="text-brand-gold hover:underline">Sign in here</Link></>
  );

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") || "").toString().trim();
    // const password = (fd.get("password") || "").toString(); // not used in demo
    await login({ email, role }); // ← uses your state/AuthContext

    // Go back to where the user was heading (e.g., /book), or to a role-based dashboard
    const fallback = role === "barber" ? "/dashboard/barber" : "/dashboard/customer";
    const from = location.state?.from?.pathname || fallback;
    navigate(from, { replace: true });
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-brand-dark via-brand-mid to-brand-dark py-10">
      <div className="container-xl">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 sm:p-10 shadow-soft [color-scheme:light]">
          <h1 className="text-3xl font-extrabold text-center text-slate-900">{title}</h1>
          <p className="mt-2 text-center text-slate-600">
            {isLogin ? "Sign in to your BarberAI account" : "Join BarberAI in a few seconds"}
          </p>

          {/* Role Tabs */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`rounded-2xl px-4 py-3 font-semibold transition
              ${role === "customer" ? "bg-brand-gold text-slate-900 shadow-soft" : "bg-slate-200 text-slate-700"}`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("barber")}
              className={`rounded-2xl px-4 py-3 font-semibold transition
              ${role === "barber" ? "bg-brand-gold text-slate-900 shadow-soft" : "bg-slate-200 text-slate-700"}`}
            >
              Barber
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            {/* Extra fields for signup */}
            {!isLogin && (
              <>
                <label className="block text-sm font-medium text-slate-700">Full name</label>
                <input
                  name="fullName"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none bg-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-gold"
                  placeholder={role === "barber" ? "e.g., Ayo Lawal" : "Your name"}
                  required
                />
              </>
            )}

            <label className="block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-slate-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                name="email"            /* ← important for FormData */
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 outline-none bg-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-gold"
                placeholder="Enter your email"
              />
            </div>

            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center  text-slate-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                name="password"         /* ← important for FormData */
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 outline-none bg-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-gold"
                placeholder="Enter your password"
              />
            </div>

            {/* Barber-specific extra on signup (optional) */}
            {!isLogin && role === "barber" && (
              <>
                <label className="block text-sm font-medium text-slate-700">Shop name (optional)</label>
                <input
                  name="shopName"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none bg-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-gold"
                  placeholder="Your barbershop name"
                />
              </>
            )}

            <button type="submit" className="btn btn-primary w-full mt-4">{cta}</button>
          </form>

          <p className="mt-6 text-center text-slate-600">{switchText}</p>
        </div>
      </div>
    </div>
  );
}
