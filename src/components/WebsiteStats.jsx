import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Lottie from "lottie-react";
import onlineClass from "../assets/Online Class.json";
import JoinEduManageSkeleton from "./JoinEduManageSkeleton";

const StatCard = ({ icon: Icon, title, count, color, onHover, isBlurred }) => (
  <motion.div
    className={`rounded-xl shadow-lg p-6 flex items-center gap-4 cursor-pointer transition-all duration-300 ${
      isBlurred ? "blur-sm opacity-70" : ""
    }`}
    style={{
      background: `linear-gradient(to right, ${color[0]}, ${color[1]})`,
    }}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    whileHover={{ scale: 1.05 }}
  >
    <Icon className="text-4xl" style={{ color: color[2] }} />
    <div>
      <h3 className="text-xl font-bold" style={{ color: color[3] }}>
        {title}
      </h3>
      <CountUp
        start={0}
        end={count}
        duration={2}
        separator=","
        className="text-3xl font-extrabold"
        style={{ color: color[4] }}
      />
    </div>
  </motion.div>
);

const WebsiteStats = () => {
  const API = import.meta.env.VITE_API_URL;
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  // Fetch users
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(`${API}/users`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch classes (supports paginated response)
  const classesQuery = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await axios.get(`${API}/classes`);
      return res.data; // ✅ Must return { classes: [], total: number }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Extract data safely
  const allClasses = classesQuery.data?.classes || []; // <-- Important!
  const totalUsers = usersQuery.data?.length || 0;
  const totalClasses = allClasses.length;
  const totalEnrollments = allClasses.reduce(
    (sum, cls) => sum + (cls.totalEnrollment || 0),
    0
  );
  const totalTeachers = usersQuery.data
    ? usersQuery.data.filter((user) => user.role === "teacher").length
    : 0;

  if (usersQuery.isLoading || classesQuery.isLoading) {
    return <JoinEduManageSkeleton/>;
  }

  if (usersQuery.isError || classesQuery.isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load stats. Please try again later.
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      count: totalUsers,
      icon: FaUsers,
      color: ["#bfdbfe", "#60a5fa", "#1e3a8a", "#1e3a8a", "#1e40af"],
    },
    {
      title: "Total Classes",
      count: totalClasses,
      icon: FaChalkboardTeacher,
      color: ["#bbf7d0", "#34d399", "#065f46", "#065f46", "#047857"],
    },
    {
      title: "Total Enrollments",
      count: totalEnrollments,
      icon: FaUserGraduate,
      color: ["#e9d5ff", "#c084fc", "#6b21a8", "#6b21a8", "#7e22ce"],
    },
    {
      title: "Active Teachers",
      count: totalTeachers,
      icon: FaUserTie,
      color: ["#fde68a", "#fbbf24", "#92400e", "#92400e", "#b45309"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 pt-16">
      {/* Section Heading */}
      <h2 className="text-3xl font-bold text-center text-blue-600 flex items-center justify-center gap-2">
        <GiTeacher className="text-blue-600" size={28} />
        Join EduManage
      </h2>

      <div className="flex flex-col-reverse md:flex-row items-center gap-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 w-full">
          {cards.map((card, index) => (
            <StatCard
              key={index}
              {...card}
              onHover={() =>
                setHoveredIndex((prev) => (prev === index ? null : index))
              }
              isBlurred={hoveredIndex !== null && hoveredIndex !== index}
            />
          ))}
        </div>

        {/* Right Side Lottie Animation */}
        <div className="flex justify-center md:justify-end w-full flex-1">
          <Lottie
            animationData={onlineClass}
            loop
            autoplay
            className="w-full max-w-xs sm:max-w-sm md:max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default WebsiteStats;
