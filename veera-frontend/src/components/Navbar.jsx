import React from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold tracking-wide">Veera Admin</h1>

      {/* Right Section: Notifications + Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <button className="relative p-2 rounded hover:bg-blue-500/20 transition">
          <BellIcon className="w-6 h-6" />
          {/* Example notification badge */}
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">3</span>
        </button>

        {/* User Icon */}
        <button className="p-2 rounded hover:bg-blue-500/20 transition flex items-center gap-2">
          <UserCircleIcon className="w-6 h-6" />
          <span className="hidden sm:inline">Admin</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
