import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="w-full bg-zinc-900/90 backdrop-blur-md border-b border-zinc-700">
      <div className="max-w-5xl mx-auto flex gap-6 px-6 py-4">
        {[
          { path: "/", label: "Play" },
          { path: "/about", label: "About" },
        ].map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-white underline underline-offset-4"
                  : "text-zinc-400 hover:text-white hover:underline hover:underline-offset-4"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}