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
  FaPlusCircle,
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

  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className="flex items-center gap-2 hover:text-blue-600"
          onClick={() => setIsOpen(false)}
        >
          <FaHome className="md:hidden lg:flex"/> Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/all-classes"
          className="flex items-center gap-2 hover:text-blue-600"
          onClick={() => setIsOpen(false)}
        >
          <FaBookOpen className="md:hidden lg:flex"/> All Classes
        </NavLink>
      </li>

      {/* Show only for logged-in users */}
      {user && (
        <li>
          <NavLink
            to="/teach"
            className="flex items-center gap-2 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            <FaChalkboardTeacher className="md:hidden lg:flex"/> Teach on EduManage
          </NavLink>
        </li>
      )}

      {/* Always visible */}
      <li>
        <NavLink
          to="/about"
          className="flex items-center gap-2 hover:text-blue-600"
          onClick={() => setIsOpen(false)}
        >
          <FaInfoCircle className="md:hidden lg:flex"/> About Us
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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-600"
        >
          <Lottie className="w-10" animationData={GraduationHat} loop />
          EduManage
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 font-medium">
          {navItems}
        </ul>

        {/* Mobile toggle */}
        <div className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <Link
              to="/login"
              className="px-4 py-1 rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:brightness-110 transition"
            >
              Sign In
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {renderProfileImage()}

              {/* Desktop Dropdown */}
              <div
                className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-20 border
                  transition-all duration-300 ease-in-out
                  ${
                    isDropdownOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }
                `}
              >
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold">{user.displayName || "User"}</p>
                  <p className="text-sm text-gray-500">{user.email || ""}</p>
                </div>
                <div className="flex flex-col">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUser /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stylish Mobile Menu */}
      {isOpen && (
        <div className="md:hidden rounded-b-xl shadow-lg bg-white px-6 py-4 animate-slide-down">
          <ul className="flex flex-col gap-4 text-base font-medium text-gray-700">
            {navItems}
          </ul>
          <div className="mt-4">
            {!user ? (
              <Link
                to="/login"
                className="block w-full text-center py-2 rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:brightness-110 transition"
                onClick={() => setIsOpen(false)}
              >
                <FaUser className="inline mr-2" /> Sign In
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/dashboard/profile"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser /> Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
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
