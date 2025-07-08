import { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import Lottie from "lottie-react";
import Swal from "sweetalert2";
import GraduationHat from "../assets/logo-animation.json";
import defaultUser from "../assets/user.jpg";
import { AuthContext } from "../contexts/AuthContext";
import NotificationPanel from "../components/NotificationPanel";

const DashboardLayout = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const role = "student"; // Make dynamic later

  const handleLogout = () => {
    signOutUser()
      .then(() => {
        setDropdownOpen(false);
        Swal.fire("Logged out!", "", "success");
        navigate("/");
      })
      .catch(console.error);
  };

  const dashboardLinks = {
    admin: [
      { to: "/dashboard/users", label: "Users" },
      { to: "/dashboard/classes", label: "Manage Classes" },
      { to: "/dashboard/profile", label: "Profile" },
      { to: "/dashboard/techers-request", label: "Teachers" },
    ],
    teacher: [
      { to: "/dashboard/add-class", label: "Add Class" },
      { to: "/dashboard/my-class", label: "My Classes" },
      { to: "/dashboard/profile", label: "Profile" },
    ],
    student: [
      { to: "/dashboard/my-enroll-class", label: "My Enrolled Classes" },
      { to: "/dashboard/profile", label: "Profile" },
    ],
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Lottie className="w-12" animationData={GraduationHat} loop />
            EduManage
          </Link>

          {/* Desktop profile */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={user.photoURL || defaultUser}
                  className="w-10 h-10 rounded-full border cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-30 transition-all duration-300 ease-in-out ${
                    dropdownOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="px-3 py-1 font-semibold text-gray-800">{user.displayName}</p>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 hover:bg-red-100 text-gray-700 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaChevronDown />}
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <ul className="md:hidden bg-white text-base font-medium px-4 pb-4 space-y-2">
            {dashboardLinks[role].map((item, idx) => (
              <li key={idx}>
                <NavLink
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="block py-1 hover:text-blue-600"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left text-red-600 hover:underline"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar for larger screens */}
        <aside className="hidden md:flex flex-col w-64 bg-white shadow-md p-6">
          <nav className="space-y-4 text-blue-800 font-medium">
            {dashboardLinks[role].map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-md transition hover:bg-blue-100 ${
                    isActive ? "bg-blue-100 font-semibold" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 px-4 rounded-md text-red-600 hover:bg-red-100 transition"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>

        {/* Right notifications */}
        <NotificationPanel />
      </div>
    </div>
  );
};

export default DashboardLayout;
