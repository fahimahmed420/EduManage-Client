import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import defaultUser from "../assets/user.jpg";
import { AuthContext } from "../contexts/AuthContext";
import GraduationHat from "../assets/logo-animation.json";
import Lottie from "lottie-react";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        Swal.fire("Logged out!", "", "success");
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const navItems = (
    <>
      <li>
        <NavLink to="/" className="hover:text-blue-500">Home</NavLink>
      </li>
      <li>
        <NavLink to="/all-classes" className="hover:text-blue-500">All Classes</NavLink>
      </li>
      <li>
        <NavLink to="/teach" className="hover:text-blue-500">Teach on EduManage</NavLink>
      </li>
    </>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 mb-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Name */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
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

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <Link to="/login" className="px-4 py-1 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition">
              Sign In
            </Link>
          ) : (
            <div className="relative group">
              <img
                src={user.photoURL || defaultUser}
                className="w-10 h-10 rounded-full border cursor-pointer"
                alt="profile"
              />
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-3 hidden group-hover:block z-20">
                <p className="font-semibold text-gray-800">{user.displayName}</p>
                <hr className="my-2" />
                <Link to="/dashboard" className="block py-1 hover:text-blue-600">Dashboard</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-1 hover:text-red-600"
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
            <Link to="/login" className="w-full border border-blue-600 rounded py-1 text-center">Sign In</Link>
          ) : (
            <div className="space-y-1">
              <p className="font-semibold">{user.displayName}</p>
              <Link to="/dashboard" className="block hover:text-blue-600">Dashboard</Link>
              <button onClick={handleLogout} className="block w-full text-left hover:text-red-600">Logout</button>
            </div>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
