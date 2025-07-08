import { Link } from "react-router-dom";
import { FaHome, FaUser, FaBook, FaUsers } from "react-icons/fa";

const Sidebar = ({ role = "student", isOpen, setIsOpen }) => {
  const links = [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    ...(role === "admin"
      ? [
          { to: "/dashboard/users", label: "Users", icon: <FaUsers /> },
          { to: "/dashboard/classes", label: "Manage Classes", icon: <FaBook /> },
        ]
      : role === "teacher"
      ? [
          { to: "/dashboard/add-class", label: "Add Class", icon: <FaBook /> },
          { to: "/dashboard/my-class", label: "My Classes", icon: <FaBook /> },
        ]
      : [
          { to: "/dashboard/my-enroll-class", label: "My Classes", icon: <FaBook /> },
          { to: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
        ]),
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 hidden md:flex flex-col gap-6 bg-white shadow-md p-6 h-[calc(100vh-64px)] overflow-y-auto z-10">
        <ul className="space-y-3">
          {links.map((link, idx) => (
            <li key={idx}>
              <Link
                to={link.to}
                className="flex items-center gap-3 text-blue-800 hover:text-blue-600 transition"
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile Dropdown Sidebar */}
      <div
        className={`absolute top-[64px] left-0 w-full bg-white z-30 transition-all duration-300 ease-in-out shadow-md md:hidden ${
          isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <ul className="flex flex-col p-4 space-y-2">
          {links.map((link, idx) => (
            <li key={idx}>
              <Link
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-blue-800 hover:text-blue-600 transition"
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
