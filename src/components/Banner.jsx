import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import GraduationHat from "../assets/logo-animation.json";
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from "framer-motion";
import { FaChalkboardTeacher, FaTasks, FaUsers, FaChartLine, FaFolderOpen } from "react-icons/fa";

const Banner = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }));
  }, [controls]);

  const cards = [
    { title: "Join Live Classes", color: "from-blue-500 to-purple-600", icon: <FaChalkboardTeacher size={30} /> },
    { title: "Assignments Hub", color: "from-pink-500 to-red-500", icon: <FaTasks size={30} /> },
    { title: "Teach on EduManage", color: "from-green-400 to-teal-500", icon: <FaChalkboardTeacher size={30} /> },
    { title: "Collaborate with Peers", color: "from-yellow-400 to-orange-500", icon: <FaUsers size={30} /> },
    { title: "Tracking Progress", color: "from-indigo-500 to-cyan-500", icon: <FaChartLine size={30} /> },
    { title: "Resource Library", color: "from-rose-500 to-pink-500", icon: <FaFolderOpen size={30} /> },
  ];

  const bubbles = [
    { size: "w-3 h-3", color: "bg-purple-300" },
    { size: "w-4 h-4", color: "bg-pink-300" },
    { size: "w-5 h-5", color: "bg-yellow-300" },
    { size: "w-2 h-2", color: "bg-green-300" },
    { size: "w-6 h-6", color: "bg-blue-300" },
  ];

  return (
    <div className="relative w-full bg-gradient-to-b from-white to-blue-50 p-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Section */}
        <div className="flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center">
              <Lottie animationData={GraduationHat} loop autoplay />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">EduManage</h1>
          </div>
          <p className="text-gray-500 text-lg max-w-md">
            One platform for students and teachers. Manage classes, assignments, and collaborate with ease.
          </p>
          <Link
            to="/all-classes"
            className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition"
          >
            Explore Now
          </Link>
        </div>

        {/* Right Section: Circular Cards */}
        <div className="relative w-72 h-72">
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {cards.map((card, index) => {
              const angle = (360 / cards.length) * index;
              const radians = (angle * Math.PI) / 180;
              const x = Math.cos(radians) * 120; // radius of circle
              const y = Math.sin(radians) * 120;

              return (
                <motion.div
                  key={index}
                  className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg p-4 bg-gradient-to-br ${card.color} text-white text-center font-semibold cursor-pointer transition duration-200 ease-in-out`}
                  style={{ translateX: x, translateY: y }}
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="flex justify-center mb-2">{card.icon}</div>
                  {card.title}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Rotating Bubbles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {bubbles.map((bubble, idx) => {
          const angle = (360 / bubbles.length) * idx;
          const radians = (angle * Math.PI) / 180;
          const x = Math.cos(radians) * 300; 
          const y = Math.sin(radians) * 300;

          return (
            <div
              key={idx}
              className={`${bubble.size} ${bubble.color} rounded-full absolute`}
              style={{
                top: `50%`,
                left: `50%`,
                transform: `translate(${x}px, ${y}px)`,
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default Banner;
