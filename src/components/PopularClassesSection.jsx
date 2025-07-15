import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { FaChalkboardTeacher } from "react-icons/fa";

const fetchPopularClasses = async () => {
  const API = import.meta.env.VITE_API_URL;
  const res = await axios.get(`${API}/classes/popular`);
  return res.data;
};

const gradientColors = [
  "from-cyan-400 to-blue-500",
  "from-blue-400 to-indigo-500",
  "from-sky-500 to-blue-700",
];

const PopularClassesSection = () => {
  const navigate = useNavigate();

  const {
    data: popularClasses,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["popularClasses"],
    queryFn: fetchPopularClasses,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  if (isLoading)
    return <div className="p-6 text-center">Loading popular classes...</div>;

  if (isError)
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load popular classes: {error.message}
        <button
          onClick={() => refetch()}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto mb-16">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-600 flex items-center justify-center gap-2">
        <FaChalkboardTeacher className="text-blue-500" size={28} />
        Popular Classes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {popularClasses.slice(0, 3).map((cls, index) => (
          <div
            key={cls._id}
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transform transition-transform duration-300 hover:scale-105 flex flex-col"
          >
            {/* Top gradient with avatar */}
            <div
              className={`h-28 rounded-t-2xl bg-gradient-to-r ${gradientColors[index]} flex justify-center items-center relative`}
            >
              <div className="absolute -bottom-14 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow-md flex justify-center items-center overflow-hidden border-4 border-white transition-all duration-300 hover:-translate-y-1">
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                />
              </div>
            </div>

            {/* Class content */}
            <div className="flex flex-col pt-20 px-4 pb-4 flex-grow text-center">
              <h3 className="text-lg font-semibold text-gray-800">{cls.title}</h3>
              <p
                className="text-sm text-gray-500 mt-2 mb-4 line-clamp-3"
                title={cls.description}
              >
                {cls.description?.slice(0, 100)}...
              </p>

              {/* Enroll Button pinned to bottom */}
              <div className="mt-auto">
                <button
                  onClick={() => navigate(`/all-classes/${cls._id}`)}
                  className={`w-full py-2 rounded-full text-white bg-gradient-to-r ${gradientColors[index]} bg-[length:200%_200%] hover:bg-[position:100%_0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-500 ease-out cursor-pointer`}
                >
                  Enroll
                </button>
              </div>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
};

export default PopularClassesSection;
