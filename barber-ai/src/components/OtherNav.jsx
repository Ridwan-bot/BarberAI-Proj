// src/components/OtherNav.jsx
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, LogOut } from "lucide-react";

/* ---------- helpers ---------- */
function getStoredUser() {
  try { return JSON.parse(localStorage.getItem("authUser") || "{}"); }
  catch { return {}; }
}
function getRole() {
  const u = getStoredUser();
  return u.role || "customer";
}
/** Single-letter avatar: prefer name/displayName, fallback to email */
function getAvatarLetter() {
  const u = getStoredUser();
  const name = (u.name || u.displayName || "").trim();
  if (name) return name.charAt(0).toUpperCase();

  const email = (u.email || "").trim();
  if (email) return email.charAt(0).toUpperCase();

  return "U";
}

export default function OtherNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const role = getRole();
  const avatarLetter = getAvatarLetter();

  // Minimal header on auth pages
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isAuthRoute) {
    return (
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#121F2F]/95 backdrop-blur">
        <div className="w-full h-16 flex items-center justify-between px-10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-amber-500 text-2xl">✂</span>
            <span className="text-white font-semibold text-lg">BarberAI</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition"
            >
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  // Full nav for dashboards / other pages
  const isBarberContext =
    pathname.startsWith("/dashboard/barber") || role === "barber";

  const appointmentsHref = isBarberContext
    ? "/dashboard/barber/appointments"
    : "/dashboard/customer/appointments";

  function handleLogout() {
    localStorage.removeItem("authUser");
    navigate("/login", { replace: true });
  }

  const link =
    "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition";
  const active = "bg-white/10 text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#121F2F]/95 backdrop-blur">
      <div className="w-full h-16 flex items-center justify-between px-10">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-amber-500 text-2xl">✂</span>
          <span className="text-white hover:text-black font-semibold text-lg">BarberAI</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink
            to={isBarberContext ? "/dashboard/barber" : "/dashboard/customer"}
            className={({ isActive }) => `${link} ${isActive ? active : ""}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>

          <NavLink
            to={appointmentsHref}
            className={({ isActive }) => `${link} ${isActive ? active : ""}`}
          >
            <CalendarDays className="h-4 w-4" />
            Appointments
          </NavLink>

          <button
            onClick={handleLogout}
            className={`${link} !text-red-300 hover:!text-white`}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>

          {/* Avatar letter from name/displayName */}
          <div className="ml-2 grid place-items-center h-9 w-9 rounded-full bg-white/10 text-white font-semibold">
            {avatarLetter}
          </div>
        </nav>
      </div>
    </header>
  );
}
