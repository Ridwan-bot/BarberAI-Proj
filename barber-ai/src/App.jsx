// src/App.jsx
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import OtherNav from "./components/OtherNav";

import Hero from "./sections/Hero";
import Features from "./sections/Features";
import Stats from "./sections/Stats";
import Reviews from "./sections/Reviews";
import CTA from "./sections/CTA";

import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingPage";
import DashboardCustomer from "./pages/DashboardCustomer";
import DashboardBarber from "./pages/DashboardBarber";

import { AuthProvider } from "./state/AuthContext";     // <— from state/
import RequireAuth from "./state/RequireAuth";          // <— from state/

function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <Reviews />
      <CTA />
    </>
  );
}

/* Layouts */
function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Outlet />
    </div>
  );
}
function MinimalLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <OtherNav />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>

        <Route element={<MinimalLayout />}>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />

          {/* protected */}
          <Route
            path="/book"
            element={
              <RequireAuth>
                <BookingPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/customer"
            element={
              <RequireAuth>
                <DashboardCustomer />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/barber"
            element={
              <RequireAuth>
                <DashboardBarber />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
