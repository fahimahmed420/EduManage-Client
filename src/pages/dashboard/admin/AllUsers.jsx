import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

const API = import.meta.env.VITE_API_URL;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (query = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/users?search=${query}`);
      console.log("Fetched users:", res.data);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchUsers(value);
  };

  const makeAdmin = async (email) => {
    const user = users.find((u) => u.email === email);
    if (!user) return;

    if (user.role === "admin") {
      console.log("User is already admin");
      return;
    }

    try {
      await axios.patch(`${API}/users/role/${email}`, { role: "admin" });
      console.log(`${email} promoted to admin.`);
      fetchUsers(search);
    } catch (err) {
      console.error("Failed to make admin:", err);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-700">Users</h1>

      {/* Softer Search Bar */}
      <div className="relative w-full md:w-1/2 mb-6">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <FiSearch size={18} />
        </span>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-50 text-gray-700 placeholder-gray-400 shadow-inner focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>

      {/* Minimal Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm md:text-base">
          <thead className="text-gray-500 font-medium">
            <tr>
              <th className="px-3 py-2 md:px-4 md:py-3 text-left">Image</th>
              <th className="px-3 py-2 md:px-4 md:py-3 text-left">Name</th>
              <th className="px-3 py-2 md:px-4 md:py-3 text-left">Email</th>
              <th className="px-3 py-2 md:px-4 md:py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-3 py-2 flex items-center">
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-3 py-2 text-gray-700">{user.name}</td>
                  <td className="px-3 py-2 text-gray-500 break-all">{user.email}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => makeAdmin(user.email)}
                      disabled={user.role === "admin"}
                      className={`text-sm md:text-base font-medium ${
                        user.role === "admin"
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-500 hover:underline"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
