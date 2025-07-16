import { useState, useRef, useContext, useEffect } from "react";
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
  FaCog,
  FaFileInvoice
} from "react-icons/fa";
import Lottie from "lottie-react";
import Swal from "sweetalert2";
import GraduationHat from "../assets/logo-animation.json";
import { AuthContext } from "../contexts/AuthContext";
import NotificationPanel from "../components/NotificationPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardLayout = () => {
  const { user, userFromDB, signOutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const role = userFromDB?.role || "student";
  const profilePhoto = userFromDB?.photo || "https://i.ibb.co/9t9cYgW/avatar.png";

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
      { to: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
      { to: "/dashboard/add-class", label: "Add Class", icon: <FaPlus /> },
      { to: "/dashboard/my-classes", label: "My Classes", icon: <FaBookOpen /> },
    ],
    student: [
      { to: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
      { to: "/dashboard/my-enroll-classes", label: "My Enrolled Classes", icon: <FaBookOpen /> },
      { to: "/dashboard/my-order", label: "My Orders", icon: <FaFileInvoice /> },
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
          <Link
            to="/"
            className="group relative flex items-center gap-2 text-lg md:text-xl font-bold text-blue-600"
          >
            <Lottie className="w-10 md:w-12" animationData={GraduationHat} loop />
            EduManage

            {/* Tooltip */}
            <span
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2
               bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0
               group-hover:opacity-100 group-hover:translate-y-1
               transition-all duration-300"
            >
              Click to go home
            </span>
          </Link>

          <h1 className="text-lg md:text-xl font-bold text-gray-600">Dashboard</h1>

          {/* Desktop profile */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border cursor-pointer object-cover"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />

                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg z-30 transition-all duration-300 origin-top-right transform
                    ${dropdownOpen
                      ? "scale-100 opacity-100 translate-y-0"
                      : "scale-95 opacity-0 pointer-events-none -translate-y-2"}
                  `}
                >
                  {/* Arrow */}
                  <div className="absolute top-0 right-5 -translate-y-1/2 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"></div>

                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-semibold text-gray-800 truncate">
                      {userFromDB?.name || user.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email || "No Email"}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="flex flex-col py-2">
                    <NavLink
                      to="/dashboard/profile"
                      className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition rounded-md"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser className="inline mr-2" /> Profile
                    </NavLink>
                    <NavLink
                      to="/dashboard/settings"
                      className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition rounded-md"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaCog className="inline mr-2" /> Settings
                    </NavLink>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition rounded-md"
                    >
                      <FaSignOutAlt className="inline mr-2" /> Logout
                    </button>
                  </div>
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
                  `flex items-center gap-3 py-2 px-3 rounded-md hover:bg-blue-50 transition ${isActive ? "bg-blue-100 font-semibold" : ""
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
