import { NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `block rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-700 hover:bg-slate-100"
  }`;

const Sidebar = () => {
  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 md:w-64 md:border-b-0 md:border-r">
      <nav className="space-y-2">
        <NavLink to="/dashboard" end className={navLinkClass}>
          Overview
        </NavLink>
        <NavLink to="/dashboard/notes" className={navLinkClass}>
          My Notes
        </NavLink>
        <NavLink to="/dashboard/shared" className={navLinkClass}>
          Shared With Me
        </NavLink>
        <NavLink to="/dashboard/trash" className={navLinkClass}>
          Trash
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;