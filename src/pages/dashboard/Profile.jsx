import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiEdit, FiSave } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  
  const [firstName, setFirstName] = useState(user?.displayName?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.displayName?.split(" ")[1] || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState("+880 1000000000");
  const [role, setRole] = useState("student");
  const [editMode, setEditMode] = useState(false);

  const handleSave = () => {
    //  Send updated values to DB here
    setEditMode(false);
    console.log("Saved:", { firstName, lastName, phone, role });
  };

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-6 mx-auto h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-blue-600">My Profile</h2>
        <button
          onClick={() => (editMode ? handleSave() : setEditMode(true))}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition"
        >
          {editMode ? <FiSave /> : <FiEdit />}
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={user?.photoURL || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-28 h-28 rounded-xl object-cover shadow-md"
        />
        <button className="text-sm text-blue-500 mt-2 hover:underline">
          Change Profile Image
        </button>
      </div>

      {/* Info Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="bg-gray-100 p-3 rounded-xl">
          <p className="text-xs text-gray-500">First Name</p>
          {editMode ? (
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-transparent w-full font-medium outline-none"
            />
          ) : (
            <p className="font-medium text-gray-800">{firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="bg-gray-100 p-3 rounded-xl">
          <p className="text-xs text-gray-500">Last Name</p>
          {editMode ? (
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-transparent w-full font-medium outline-none"
            />
          ) : (
            <p className="font-medium text-gray-800">{lastName}</p>
          )}
        </div>

        {/* Email (Read-only) */}
        <div className="bg-gray-100 p-3 rounded-xl flex justify-between items-center col-span-1 md:col-span-2">
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{email}</p>
          </div>
          <FiCopy className="text-gray-500 cursor-pointer" />
        </div>

        {/* Phone Number */}
        <div className="bg-gray-100 p-3 rounded-xl flex justify-between items-center col-span-1 md:col-span-2">
          <div className="w-full">
            <p className="text-xs text-gray-500">Phone Number</p>
            {editMode ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent w-full font-medium outline-none"
              />
            ) : (
              <p className="font-medium text-gray-800">{phone}</p>
            )}
          </div>
          <FiCopy className="text-gray-500 cursor-pointer" />
        </div>

        {/* Role */}
        <div className="bg-gray-100 p-3 rounded-xl col-span-1 md:col-span-2">
          <p className="text-xs text-gray-500">Role</p>
          {editMode ? (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-transparent font-medium outline-none"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            <p className="font-medium capitalize text-gray-800">{role}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
