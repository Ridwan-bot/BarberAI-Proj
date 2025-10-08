// src/components/OtherNav.jsx
import { NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarDays, LogOut } from "lucide-react";

const linkCls =
  "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition";

const activeCls =
  "bg-white/10 text-white";

export default function OtherNav() {
  const navigate = useNavigate();
  function handleLogout() {
    // stub: clear your auth token/session here
    localStorage.removeItem("authUser");
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#121F2F]/95 backdrop-blur">
      <div className="container-xl h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-amber-500 text-2xl">✂</span>
          <span className="text-white font-semibold text-lg">BarberAI</span>
        </Link>

        {/* Right-side actions */}
        <nav className="flex items-center gap-1">
          <NavLink
            to="/dashboard/customer"
            className={({ isActive }) =>
              `${linkCls} ${isActive ? activeCls : ""}`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>

          <NavLink
            to="/book"
            className={({ isActive }) =>
              `${linkCls} ${isActive ? activeCls : ""}`
            }
          >
            <CalendarDays className="h-4 w-4" />
            Appointments
          </NavLink>

          <button onClick={handleLogout} className={`${linkCls} !text-red-300 hover:!text-white`}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>

          {/* Avatar (no email shown) */}
          <div className="ml-2 grid place-items-center h-9 w-9 rounded-full bg-white/10 text-white font-semibold">
            J
          </div>
        </nav>
      </div>
    </header>
  );
}
