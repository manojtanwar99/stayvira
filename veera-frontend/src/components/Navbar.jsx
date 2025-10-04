import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/authStore";
import { getImageUrl } from "../utility/utility";
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);


  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    { name: "Listings", path: "/listings", icon: BuildingOfficeIcon },
    { name: "Analytics", path: "/analytics", icon: ChartBarIcon },
    { name: "Settings", path: "/settings", icon: Cog6ToothIcon },
  ];

  const mockNotifications = [
    { id: 1, title: "New booking request", time: "5 min ago", unread: true },
    { id: 2, title: "Payment received", time: "1 hour ago", unread: true },
    { id: 3, title: "Review posted", time: "2 hours ago", unread: true },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold tracking-tight hover:text-blue-100 transition-colors"
          >
            <BuildingOfficeIcon className="w-8 h-8" />
            <span className="hidden sm:inline">Veera Admin</span>
            <span className="sm:hidden">Veera</span>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-700/50 transition-colors text-sm font-medium"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-full hover:bg-blue-700/50 transition-colors"
                    aria-label="Notifications"
                  >
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-blue-600">
                      {mockNotifications.filter(n => n.unread).length}
                    </span>
                  </button>

                  {/* Notifications Dropdown Menu */}
                  {notificationsOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setNotificationsOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20 text-gray-800">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                          <h3 className="text-white font-semibold">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {mockNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                notification.unread ? 'bg-blue-50' : ''
                              }`}
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-center">
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View all notifications
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* User Menu - Desktop */}
                <div onClick={() => navigate('/user')}
                className="hidden sm:flex items-center space-x-3 bg-blue-700/30 rounded-full px-3 py-1.5">
                  {user?.image ? (
                    <img
                      src={getImageUrl(user.image)}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-blue-100" />
                  )}
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-blue-200">
                      {user?.email || "admin@veera.com"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-full hover:bg-blue-600 transition-colors"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="sm:hidden p-2 rounded-lg hover:bg-blue-700/50 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="w-6 h-6" />
                  ) : (
                    <Bars3Icon className="w-6 h-6" />
                  )}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-md"
              >
                <UserPlusIcon className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-500 py-4 space-y-2">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700/50 transition-colors"
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}

            {/* Mobile User Info */}
            <div className="sm:hidden px-4 py-3 bg-blue-700/30 rounded-lg mt-4">
              <div className="flex items-center gap-3 mb-3">
                <UserCircleIcon className="w-10 h-10 text-blue-100" />
                <div>
                  <p className="font-medium">{user?.name || "Admin"}</p>
                  <p className="text-sm text-blue-200">
                    {user?.email || "admin@veera.com"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;