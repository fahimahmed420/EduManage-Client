import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { FaChalkboardTeacher } from "react-icons/fa";
import PopularClassesSkeleton from "./PopularClassesSkeleton";

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
    return <PopularClassesSkeleton />;

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
    <div className="p-4 max-w-7xl mx-auto mb-16">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-blue-600 flex items-center justify-center gap-2">
        <FaChalkboardTeacher className="text-blue-500" size={28} />
        Popular Classes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularClasses.map((cls, index) => (
          <div
            key={cls._id}
            className={`relative shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105 flex flex-col h-full bg-gradient-to-r ${gradientColors[index % gradientColors.length]
              } text-white`}
          >
            {/* Avatar */}
            <div className="flex justify-center items-center mt-6">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow-md flex justify-center items-center overflow-hidden border-4 border-white transition-all duration-300 hover:-translate-y-1">
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                />
              </div>
            </div>

            {/* Class content */}
            <div className="flex flex-col px-4 pb-4 pt-6 flex-grow text-center">
              <h3 className="text-lg font-semibold">{cls.title}</h3>
              <p
                className="text-sm opacity-90 mt-2 mb-4 line-clamp-3"
                title={cls.description}
              >
                {cls.description?.slice(0, 100)}...
              </p>

              {/* Enroll Button */}
              <div className="mt-auto">
                <button
                  onClick={() => navigate(`/all-classes/${cls._id}`)}
                  className="w-full py-2 rounded-full text-blue-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 cursor-pointer"
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
