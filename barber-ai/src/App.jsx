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
import CustomerAppointments from "./pages/CustomerAppointments";
import BarberAppointments from "./pages/BarberAppointments";
import RoleRoute from "./state/RoleRoute";


import { AuthProvider } from "./state/AuthContext";
import RequireAuth from "./state/RequireAuth";

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
        {/* Public marketing site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>

        {/* Auth + app shell with slim nav */}
        <Route element={<MinimalLayout />}>
          {/* Auth pages */}
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />

          {/* Protected app pages */}
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
          {/* barber appointments list */}
          <Route
            path="/dashboard/barber/appointments"
            element={
              <RequireAuth>
                <BarberAppointments />
              </RequireAuth>
            }
          />

          {/* customer appointments page list */}
          <Route
            path="/dashboard/customer/appointments"
            element={
              <RequireAuth>
                <CustomerAppointments />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
