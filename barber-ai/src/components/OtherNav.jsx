// src/components/OtherNav.jsx
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, LogOut } from "lucide-react";

function getRole() {
  try {
    const u = JSON.parse(localStorage.getItem("authUser") || "{}");
    return u.role || "customer";
  } catch { return "customer"; }
}

export default function OtherNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const role = getRole();

  // If you’re in the barber area OR your role is barber → go to barber appointments
  const isBarberContext =
    pathname.startsWith("/dashboard/barber") || role === "barber";

  const appointmentsHref = isBarberContext
    ? "/dashboard/barber/appointments"
    : "/dashboard/customer/appointments";

  // ...rest unchanged...
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#121F2F]/95 backdrop-blur">
      <div className="container-xl h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-amber-500 text-2xl">✂</span>
          <span className="text-white font-semibold text-lg">BarberAI</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink
            to={isBarberContext ? "/dashboard/barber" : "/dashboard/customer"}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition ${
                isActive ? "bg-white/10 text-white" : ""
              }`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>

          <NavLink
            to={appointmentsHref}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition ${
                isActive ? "bg-white/10 text-white" : ""
              }`
            }
          >
            <CalendarDays className="h-4 w-4" />
            Appointments
          </NavLink>

          <button
            onClick={() => { localStorage.removeItem("authUser"); navigate("/login", { replace: true }); }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition !text-red-300 hover:!text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>

          <div className="ml-2 grid place-items-center h-9 w-9 rounded-full bg-white/10 text-white font-semibold">
            {(JSON.parse(localStorage.getItem("authUser") || "{}").name || "U")[0]}
          </div>
        </nav>
      </div>
    </header>
  );
}
