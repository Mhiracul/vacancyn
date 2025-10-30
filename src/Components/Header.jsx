import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  CircleUserRound,
  UserPlus,
  LayoutDashboard,
  Briefcase,
  Star,
  GraduationCap,
  FileText,
  Layers,
  LogOut,
  House,
  SearchSlash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/Logoo.svg";
import { JobsContext } from "../context/jobContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import BASE_URL from "../config";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(JobsContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pathname = location.pathname;

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {}
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/home");
  };

  // Desktop navigation (main links only)

  const desktopLinks = [
    { path: "/home", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/findwork", label: "Find Job" },
    { path: "/cv-review", label: "CV Review" },
    { path: "/pricing-page", label: "Pricing" },
  ];

  // Filter for recruiter
  const filteredDesktopLinks =
    user?.role === "recruiter"
      ? desktopLinks.filter(
          (link) => link.label !== "Find Job" && link.label !== "Pricing"
        )
      : desktopLinks;

  // Mobile links (all links + icons, including dashboard and courses)
  const mobileLinks = user
    ? user.role === "recruiter"
      ? [{ path: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]
      : [
          { path: "/home", label: "Home", icon: House },
          { path: "/about", label: "About", icon: SearchSlash },
          { path: "/findwork", label: "Find Job", icon: Briefcase },
          { path: "/cv-review", label: "CV Review", icon: FileText },
          { path: "/pricing-page", label: "Pricing", icon: Layers },
          { path: "/dashboard", label: "My Dashboard", icon: LayoutDashboard },
          {
            path: "/account-setup/user",
            label: "Career Profile",
            icon: FileText,
          },
          {
            path: "/dashboard/view-applications",
            label: "Applications",
            icon: Briefcase,
          },
          { path: "/dashboard/favorite-jobs", label: "Saved Jobs", icon: Star },
          { path: "/courses", label: "My Courses", icon: GraduationCap },
        ]
    : [
        { path: "/home", label: "Home", icon: null },
        { path: "/about", label: "About", icon: null },
        { path: "/findwork", label: "Find Job", icon: Briefcase },
        { path: "/cv-review", label: "CV Review", icon: FileText },
        { path: "/pricing-page", label: "Pricing", icon: Layers },
      ];

  return (
    <header className="py-4 shadow text-[#4b5563] font-outfit bg-white relative z-[9999]">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="cursor-pointer h-10 md:h-12" />
          <h1 className="font-extrabold text-xl md:text-2xl text-[#0867bc]">
            Vacancy.NG
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex text-base items-center gap-6">
          {filteredDesktopLinks.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`py-2 px-4 rounded-md transition-all duration-200 ${
                  pathname === path ? "text-[#0867bc]" : "hover:text-[#0867bc]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side icons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 py-2 px-4 rounded-full text-sm text-gray-600 hover:text-gray-900 transition-all"
            >
              <CircleUserRound strokeWidth={1.5} className="w-7 h-7" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/recruiter-login")}
                className="py-2 px-6 text-base text-gray-600"
              >
                Employer’s Login
              </button>
              <button
                onClick={() => navigate("/login")}
                className="py-2 px-6 text-base rounded-full bg-[#0867bc] flex items-center gap-2 text-white hover:bg-[#065ba3]"
              >
                <UserPlus className="w-4 h-4" />
                Login
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#0867bc] focus:outline-none"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown with icons */}
      {/* Mobile dropdown with icons */}
      {/* Mobile dropdown with icons */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="absolute top-full left-0 w-full bg-white shadow-md md:hidden flex flex-col items-center py-4 gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Links */}
            {mobileLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`w-11/12 flex items-center gap-3 py-3 px-6 rounded-md border ${
                  pathname === path
                    ? "border-[#0867bc] text-[#0867bc]"
                    : "border-gray-200 text-gray-700 hover:text-[#0867bc]"
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {label}
              </Link>
            ))}

            {/* Show Sign Out only if user is logged in */}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-11/12 flex items-center gap-3 py-3 px-6 rounded-md border border-gray-200 text-gray-700 hover:text-[#0867bc]"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            )}

            {/* Show login buttons only if user is logged out */}
            {!user && (
              <div className="flex flex-col w-11/12 gap-2 mt-2">
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="w-full py-3 px-6 rounded-md bg-[#0867bc] text-white flex items-center justify-center gap-2 hover:bg-[#065ba3]"
                >
                  <UserPlus className="w-5 h-5" /> Login
                </button>

                <button
                  onClick={() => {
                    navigate("/recruiter-login");
                    setMenuOpen(false);
                  }}
                  className="w-full py-3 px-6 rounded-md border border-gray-200 text-gray-700 hover:text-[#0867bc]"
                >
                  Employer’s Login
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-[40]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-[50] flex flex-col justify-between"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="p-6 overflow-y-auto flex-1">
                <h2 className="text-lg border-b py-3 border-gray-200 font-semibold mb-6">
                  Account Information
                </h2>
                <ul className="space-y-4">
                  {mobileLinks
                    .filter(
                      (link) =>
                        link.path.startsWith("/dashboard") ||
                        link.path.startsWith("/account-setup") ||
                        link.path === "/courses"
                    )
                    .map(({ path, label, icon: Icon }) => (
                      <li key={path}>
                        <Link
                          to={path}
                          className="flex items-center gap-3 text-gray-700 hover:text-[#0867bc]"
                          onClick={() => setDrawerOpen(false)}
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                          {label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-[#0867bc] hover:underline"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
