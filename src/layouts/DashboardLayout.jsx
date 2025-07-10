import { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardList,
  FaPlus,
  FaBookOpen,
  FaSignOutAlt,
  FaAngleLeft,
  FaAngleRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Lottie from "lottie-react";
import Swal from "sweetalert2";
import axios from "axios"; // 👈 import axios
import GraduationHat from "../assets/logo-animation.json";
import defaultUser from "../assets/user.jpg";
import { AuthContext } from "../contexts/AuthContext";
import NotificationPanel from "../components/NotificationPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "http://localhost:5000"; // 👈 Replace with your backend URL

const DashboardLayout = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop sidebar collapsed state
  const [profilePhoto, setProfilePhoto] = useState(defaultUser); // 👈 state for profile photo
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const role = user?.role || "student";

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
      { to: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
      { to: "/dashboard/all-users", label: "Users", icon: <FaUsers /> },
      { to: "/dashboard/all-classes", label: "Manage Classes", icon: <FaChalkboardTeacher /> },
      { to: "/dashboard/teacher-requests", label: "Teachers", icon: <FaClipboardList /> },
    ],
    teacher: [
      { to: "/dashboard/add-class", label: "Add Class", icon: <FaPlus /> },
      { to: "/dashboard/my-class", label: "My Classes", icon: <FaBookOpen /> },
      { to: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
    ],
    student: [
      { to: "/dashboard/my-enroll-class", label: "My Enrolled Classes", icon: <FaBookOpen /> },
      { to: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
    ],
  };

  // Fetch user profile photo from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(`${API}/users/${user.email}`);
          // Set photo from DB or fallback to Firebase or default
          setProfilePhoto(res.data.photo || user.photoURL || defaultUser);
        } catch (err) {
          console.error("❌ Failed to fetch user profile:", err);
          setProfilePhoto(user.photoURL || defaultUser);
        }
      }
    };

    fetchUserProfile();
  }, [user?.email]);

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
          <Link
            to="/"
            className="flex items-center gap-2 text-lg md:text-xl font-bold text-blue-600"
          >
            <Lottie className="w-10 md:w-12" animationData={GraduationHat} loop />
            EduManage
          </Link>

          {/* Desktop profile */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={profilePhoto} // 👈 use fetched photo
                  alt="Profile"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border cursor-pointer object-cover"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                <div
                  className={`absolute right-0 mt-2 w-44 md:w-48 bg-white border rounded-md shadow-lg z-30 transition-all duration-200 ${
                    dropdownOpen
                      ? "max-h-60 opacity-100"
                      : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="px-3 py-2 text-gray-800 font-semibold truncate">
                    {user.displayName}
                  </p>
                  <hr />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div
            className="md:hidden text-2xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t">
            <ul className="px-4 py-2 space-y-2">
              {dashboardLinks[role].map((item, idx) => (
                <li key={idx}>
                  <NavLink
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-blue-50"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left py-2 px-2 text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt className="inline mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-white shadow-sm p-4 transition-all duration-300
            ${sidebarCollapsed ? "w-20" : "w-52"}
          `}
          style={{ borderRight: "1px solid #e5e7eb" }}
        >
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="self-end mb-4 p-1 rounded-md hover:bg-gray-100 text-gray-500"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <FaAngleRight /> : <FaAngleLeft />}
          </button>

          <nav className="flex flex-col gap-1 text-gray-700 flex-grow">
            {dashboardLinks[role].map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-3 rounded-md hover:bg-blue-50 transition ${
                    isActive ? "bg-blue-100 font-semibold" : ""
                  }`
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className="text-lg flex-shrink-0">{item.icon}</div>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 py-2 px-3 rounded-md text-red-600 hover:bg-red-50"
              title={sidebarCollapsed ? "Logout" : undefined}
            >
              <FaSignOutAlt className="text-lg flex-shrink-0" />
              {!sidebarCollapsed && "Logout"}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto" style={{ minWidth: 0 }}>
          <Outlet />
        </main>

        {/* Right notifications */}
        <NotificationPanel />
      </div>

      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default DashboardLayout;
