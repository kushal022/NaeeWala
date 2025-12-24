import { NavLink } from "react-router-dom";

const links = [
  { to: "/barber", label: "Dashboard" },
  { to: "/barber/appointments", label: "Appointments" },
  { to: "/barber/services", label: "Services" },
  { to: "/barber/profile", label: "Profile" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 hidden md:block bg-surface border-r border-black/10 dark:border-white/10">
      <nav className="p-4 space-y-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-text ${
                isActive
                  ? "bg-bg font-semibold"
                  : "hover:bg-bg"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
