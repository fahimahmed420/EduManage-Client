import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
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

  // Fetch user profile photo
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
        Swal.fire("Logged out!", "", "success");
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  const navItems = (
    <>
      <li>
        <NavLink to="/" className="hover:text-blue-500">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/all-classes" className="hover:text-blue-500">
          All Classes
        </NavLink>
      </li>
      <li>
        <NavLink to="/teach" className="hover:text-blue-500">
          Teach on EduManage
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show loading or error in profile photo section on desktop
  const renderProfileImage = () => {
    if (isLoading) {
      // You can return a spinner or placeholder during loading
      return (
        <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
      );
    }

    if (error) {
      // Show default avatar if error
      return (
        <img
          src={DEFAULT_AVATAR}
          alt="profile"
          className="w-10 h-10 rounded-full cursor-pointer relative z-10 object-cover"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
      );
    }

    // Normal profile image
    return (
      <img
        src={profilePhoto}
        alt="profile"
        className="w-10 h-10 rounded-full cursor-pointer relative z-10 object-cover"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onError={(e) => (e.target.src = DEFAULT_AVATAR)}
      />
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Name */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-600"
        >
          <Lottie className="w-12" animationData={GraduationHat} loop={true} />
          EduManage
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 font-medium">
          {navItems}
        </ul>

        {/* Mobile toggle */}
        <div className="md:hidden text-xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Auth buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <Link
              to="/login"
              className="px-4 py-1 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
            >
              Sign In
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {renderProfileImage()}

              {/* Slide-down dropdown */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-gray-100 border border-gray-300 shadow-lg rounded-md p-3 z-20 overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-in-out
                  ${isDropdownOpen
                    ? "max-h-60 opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
                  }
                `}
              >
                <p className="font-semibold text-gray-800">{user.displayName}</p>
                <hr className="my-2 border-gray-300" />
                <Link
                  to="/dashboard/profile"
                  className="block py-2 px-2 rounded hover:bg-blue-100 text-gray-700 hover:text-blue-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-1 px-2 rounded hover:bg-red-100 text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col gap-3 px-4 pb-4 text-base font-medium bg-white">
          {navItems}
          {!user ? (
            <Link
              to="/login"
              className="w-full border border-blue-600 rounded py-1 text-center"
            >
              Sign In
            </Link>
          ) : (
            <div className="space-y-1">
              <Link
                to="/dashboard/profile"
                className="block hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left hover:text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
