import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const StatCard = ({ icon: Icon, title, count, color }) => (
  <motion.div
    className="rounded-xl shadow-lg p-6 flex items-center gap-4"
    style={{
      background: `linear-gradient(to right, ${color[0]}, ${color[1]})`,
    }}
    whileHover={{ scale: 1.05 }}
  >
    <Icon className="text-4xl lg:hidden xl:flex" style={{ color: color[2] }} />
    <div>
      <h3 className="text-lg md:text-xl font-bold" style={{ color: color[3] }}>
        {title}
      </h3>
      <CountUp
        start={0}
        end={count}
        duration={2}
        separator=","
        className="text-2xl md:text-3xl font-extrabold"
        style={{ color: color[4] }}
      />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const API = import.meta.env.VITE_API_URL;

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(`${API}/users`);
      return res.data;
    },
  });

  const classesQuery = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await axios.get(`${API}/classes`);
      return res.data.classes;
    },
  });

  if (usersQuery.isLoading || classesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (usersQuery.isError || classesQuery.isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load data. Please try again later.
      </div>
    );
  }

  const users = usersQuery.data;
  const classes = classesQuery.data;

  const totalUsers = users.length;
  const totalTeachers = users.filter((u) => u.role === "teacher").length;
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalClasses = classes.length;

  const cards = [
    {
      title: "Total Users",
      count: totalUsers,
      icon: FaUsers,
      color: ["#bfdbfe", "#60a5fa", "#1e3a8a", "#1e3a8a", "#1e40af"],
    },
    {
      title: "Total Teachers",
      count: totalTeachers,
      icon: FaUserTie,
      color: ["#fde68a", "#fbbf24", "#92400e", "#92400e", "#b45309"],
    },
    {
      title: "Total Students",
      count: totalStudents,
      icon: FaUserGraduate,
      color: ["#e9d5ff", "#c084fc", "#6b21a8", "#6b21a8", "#7e22ce"],
    },
    {
      title: "Total Classes",
      count: totalClasses,
      icon: FaChalkboardTeacher,
      color: ["#bbf7d0", "#34d399", "#065f46", "#065f46", "#047857"],
    },
  ];

  const recentUsers = users
    .filter((user) => user.role !== "admin")
    .slice(-5)
    .reverse();

  const topClasses = [...classes]
    .sort((a, b) => (b.totalEnrollment || 0) - (a.totalEnrollment || 0))
    .slice(0, 5);

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </div>

      {/* Insights Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Recent Users */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            Recent Users
          </h3>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <ul className="divide-y divide-gray-200">
              {recentUsers.map((user, idx) => (
                <li
                  key={idx}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <div className="text-gray-800 font-semibold">
                      {user.name}
                    </div>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 capitalize">
                    {user.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top Classes */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            Top Classes by Enrollment
          </h3>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <ul className="divide-y divide-gray-200">
              {topClasses.map((cls, idx) => (
                <li
                  key={idx}
                  className="py-3 flex justify-between items-center"
                >
                  <div className="text-gray-700 font-medium">
                    {cls.title || "Unnamed Class"}
                  </div>
                  <div className="text-blue-600 font-bold">
                    {cls.totalEnrollment || 0} Enrolled
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
