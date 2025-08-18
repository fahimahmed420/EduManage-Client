import React, { useContext, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiCopy, FiEdit, FiSave } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+8801000000000");
  const [role, setRole] = useState("student");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/users/${user.email}`);
        const data = res.data;
        setProfile(data);
        setFirstName(data.firstName || user?.displayName?.split(" ")[0] || "");
        setLastName(data.lastName || user?.displayName?.split(" ")[1] || "");
        setEmail(data.email || user?.email || "");
        setPhone(data.phone || "+8801000000000");
        setRole(data.role || "student");
        setBio(data.bio || "");
        setPhoto(data.photo || user?.photoURL || "");
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
        toast.error("Failed to load profile.");
      }
    };

    fetchProfile();
  }, [user.email]);

  const handleSave = async () => {
    try {
      const updatedFields = {
        firstName,
        lastName,
        phone,
        bio,
        photo,
      };

      await axios.patch(`${API}/users/${profile._id}`, updatedFields);
      toast.success("Profile updated successfully!");
      setEditMode(false);
      setProfile((prev) => ({ ...prev, ...updatedFields }));
    } catch (err) {
      console.error("❌ Failed to save profile:", err);
      toast.error("Failed to update profile.");
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-1/2">
        <div className="flex gap-x-2">
          <div className="w-5 h-5 bg-[#d991c2] animate-pulse rounded-full"></div>
          <div className="w-5 h-5 bg-[#9869b8] animate-bounce rounded-full"></div>
          <div className="w-5 h-5 bg-[#6756cc] animate-pulse rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-theme rounded-3xl my-12 shadow-2xl p-4 md:p-6 lg:p-10 xl:p-16 mx-auto max-w-7xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-theme">My Profile</h2>
        <button
          onClick={() => (editMode ? handleSave() : setEditMode(true))}
          className="flex items-center gap-2 bg-blue-500 text-white cursor-pointer px-4 py-1 rounded-full hover:bg-blue-700 transition"
        >
          {editMode ? <FiSave /> : <FiEdit />}
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={photo || "https://i.ibb.co/9t9cYgW/avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />
        {editMode && (
          <input
            type="text"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="Enter Photo URL"
            className="mt-2 px-3 py-2 w-full rounded-md border bg-gray-100 text-sm outline-none"
          />
        )}
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
            <h3 className="font-medium text-gray-800">{firstName}</h3>
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
            <h3 className="font-medium text-gray-800">{lastName}</h3>
          )}
        </div>

        {/* Email (Read-only) */}
        <div className="bg-gray-100 p-3 rounded-xl col-span-1 md:col-span-2">
          <p className="text-xs text-gray-500">Email</p>
          <h3 className="font-medium text-gray-800">{email}</h3>
        </div>

        {/* Phone Number */}
        <div className="bg-gray-100 p-3 rounded-xl col-span-1 md:col-span-2">
          <p className="text-xs text-gray-500">Phone</p>
          {editMode ? (
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-transparent w-full font-medium outline-none"
            />
          ) : (
            <h3 className="font-medium text-gray-800">{phone}</h3>
          )}
        </div>

        {/* Role (Read-only) */}
        <div className="bg-gray-100 p-3 rounded-xl col-span-1 md:col-span-2">
          <p className="text-xs text-gray-500">Role</p>
          <h3 className="font-medium capitalize text-gray-800">{role}</h3>
        </div>

        {/* Bio */}
        <div className="bg-gray-100 p-3 rounded-xl col-span-1 md:col-span-2">
          <p className="text-xs text-gray-500">Bio</p>
          {editMode ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Write something about yourself..."
              className="bg-transparent w-full font-medium outline-none resize-none"
            />
          ) : (
            <h3 className="font-medium text-gray-800">{bio || "No bio yet"}</h3>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
