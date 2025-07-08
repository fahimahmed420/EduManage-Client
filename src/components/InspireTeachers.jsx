import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import TeachingAnimation from "../assets/inspire_teacher.json";

const InspireTeachers = () => {
  return (
    <div className="w-full bg-gradient-to-b from-white to-purple-50 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Animation */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Lottie
            animationData={TeachingAnimation}
            loop
            autoplay
            style={{ height: "300px", width: "300px" }}
          />
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Inspire Students. Share Your Knowledge.
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Join EduManage as a teacher and impact thousands of learners. Teach live classes, share assignments, and grow your teaching career while helping students succeed.
          </p>
          <Link
            to="/become-a-teacher"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition duration-300 w-fit"
          >
            Start Teaching
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InspireTeachers;
