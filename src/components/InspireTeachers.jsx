import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import TeachingAnimation from "../assets/inspire_teacher.json";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { GiTeacher } from "react-icons/gi";

const InspireTeachers = () => {
  return (
    <div className="py-16 max-w-7xl px-4 mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-600 flex items-center justify-center gap-2 mb-8">
        <GiTeacher className="text-blue-600" size={28} />
        Join EduManage
      </h2>
      <div className=" flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Animation */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Lottie
            animationData={TeachingAnimation}
            loop
            autoplay
            style={{ height: "300px", width: "300px" }}
          />
        </div>

        {/* Right: Text with Animation */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col justify-center"
          initial={{ opacity: 0, y: 50 }} // Start hidden + lower
          whileInView={{ opacity: 1, y: 0 }} // Animate to visible
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }} // Trigger only once when 40% visible
        >
          <h2 className="text-4xl font-bold text-gray-700 mb-4 text-center md:text-end">
            Inspire Students. Share Your Knowledge.
          </h2>
          <p className="text-gray-600 text-lg mb-6 text-center md:text-end">
            Join EduManage as a teacher and impact thousands of learners. Teach
            live classes, share assignments, and grow your teaching career while
            helping students succeed.
          </p>
          <div className="flex justify-center md:justify-end">
            <Link
              to="/teach"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition duration-300 w-fit"
            >
              Start Teaching
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InspireTeachers;
