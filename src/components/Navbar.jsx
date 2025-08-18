import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUser,
  FaChalkboardTeacher,
  FaHome,
  FaBookOpen,
  FaInfoCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthContext";
import GraduationHat from "../assets/logo-animation.json";
import Lottie from "lottie-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const DEFAULT_AVATAR = "/src/assets/user.jpg";

  const {
    data: userProfile,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["userProfile", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axios.get(`${API}/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5,
    onError: (err) => {
      console.error("❌ Failed to fetch user profile:", err);
    },
  });

  const profilePhoto = userProfile?.photo || DEFAULT_AVATAR;

  const handleLogout = () => {
    signOutUser()
      .then(() => {
        setIsDropdownOpen(false);
        setIsOpen(false);
        Swal.fire("Logged out!", "", "success");
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.removeAttribute("data-theme"); // light
    } else {
      document.documentElement.setAttribute("data-theme", "dark"); // dark
    }
    setIsDark(!isDark);
  };

  const themeButton = (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isDark}
        onChange={toggleTheme}
      />
      <div
        className="w-20 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 
               peer-checked:from-gray-400 peer-checked:to-gray-700
               transition-all duration-500 relative after:content-['☀️'] 
               after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full 
               after:h-8 after:w-8 after:flex after:items-center after:justify-center 
               after:transition-all after:duration-500 peer-checked:after:translate-x-10 
               peer-checked:after:content-['🌙'] after:shadow-md after:text-lg"
      ></div>
    </label>
  );

  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className="flex text-theme text-theme-hover items-center gap-2 transition-colors duration-300"
          onClick={() => setIsOpen(false)}
        >
          <FaHome className="md:hidden lg:flex" /> Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/all-classes"
          className="flex text-theme text-theme-hover items-center gap-2 transition-colors duration-300"
          onClick={() => setIsOpen(false)}
        >
          <FaBookOpen className="md:hidden lg:flex" /> All Classes
        </NavLink>
      </li>

      {user && (
        <li>
          <NavLink
            to="/teach"
            className="flex text-theme text-theme-hover items-center gap-2 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            <FaChalkboardTeacher className="md:hidden lg:flex" /> Teach on EduManage
          </NavLink>
        </li>
      )}

      <li>
        <NavLink
          to="/about"
          className="flex text-theme text-theme-hover items-center gap-2 transition-colors duration-300"
          onClick={() => setIsOpen(false)}
        >
          <FaInfoCircle className="md:hidden lg:flex" /> About Us
        </NavLink>
      </li>
    </>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderProfileImage = () => {
    if (isLoading) {
      return <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />;
    }

    return (
      <img
        src={profilePhoto}
        alt="profile"
        className="w-10 h-10 rounded-full cursor-pointer object-cover"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onError={(e) => (e.target.src = DEFAULT_AVATAR)}
      />
    );
  };

  return (
    <nav className="bg-theme shadow-md sticky top-0 z-50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-theme text-theme-hover transition-colors duration-300"
        >
          <Lottie className="w-10" animationData={GraduationHat} loop />
          EduManage
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 font-medium">
          {navItems}
        </ul>

        {/* Mobile toggle */}
        <div
          className="md:hidden text-2xl text-theme text-theme-hover transition-colors duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {themeButton}
          {!user ? (
            <Link
              to="/login"
              className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:brightness-110 transition"
            >
              Sign In
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {renderProfileImage()}

              {/* Desktop Dropdown */}
              <div
                className={`absolute right-0 mt-3 w-56 bg-theme rounded-xl shadow-xl z-20 border border-gray-200/40
                  transition-all duration-300 ease-in-out
                  ${isDropdownOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                  }
                `}
              >
                <div className="px-4 py-3 border-b border-gray-200/40">
                  <p className="font-semibold text-theme">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-sm text-theme">{user.email || ""}</p>
                </div>
                <div className="flex flex-col">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-theme text-theme-hover transition-colors duration-300"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUser /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-b-xl text-red-600 hover:bg-red-100 dark:hover:bg-red-800 transition"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden shadow-lg bg-theme px-6 py-4 animate-slide-down transition-colors duration-500">
          <ul className="flex flex-col gap-4 text-base font-medium text-theme mb-4">
            {navItems}
          </ul>
          {themeButton}
          <div className="flex items-center justify-between">
            {!user ? (
              <Link
                to="/login"
                className="block text-center py-2 px-4 rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:brightness-110 transition"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded text-theme text-theme-hover transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
